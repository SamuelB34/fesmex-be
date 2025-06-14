import mongoose from "mongoose"
import Quotes, {
	CreatedMethod,
	QuoteStatus,
	QuotesType,
	Status,
} from "../../models/quotes"
import { pipedriveDirectory } from "../../common/directory/pipedriveDirectory"
import {
	convertToTijuanaTime,
	getCurrentDateTime,
} from "../../common/auth/dateFunctions"
import axios from "axios"
import {
	createOrganization,
	createPersonOrganization,
	getDealById,
	updateQuote,
	updateQuoteStage,
	updateQuoteStatus,
} from "../../middlewares/pipedrive"
import Users from "../../models/users"

export const quotesResolvers = {
	Query: {
		// Fetch a quote by its ID
		getQuoteById: async (_: any, { id }: { id: string }) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const quote = await Quotes.findById(id)
				.populate("article.article_number")
				.populate("created_by", "first_name last_name")
			if (!quote) throw new Error("Quote not found")

			return quote
		},

		getAllQuotes: async (
			_: any,
			{
				page = 1,
				pageSize = 10,
				sortBy = "date",
				sortOrder = "desc",
				filters = {},
				startDate,
				endDate,
			}: {
				page: number
				pageSize: number
				sortBy: string
				sortOrder: string
				filters?: Record<string, any>
				startDate?: string
				endDate?: string
			},
			context
		) => {
			const user = context.user
			const sortDirection = sortOrder === "asc" ? 1 : -1
			const searchFilter: any = {
				deleted_at: { $exists: false },
			}

			if (user.role !== "admin") {
				searchFilter.created_by = user.id
			}

			if (filters.created_by && filters.only_last) {
				const lastQuote = await Quotes.findOne({
					...searchFilter,
					created_by: filters.created_by,
				})
					.sort({ quote_number: -1 })
					.populate("article.article_number")
					.populate("created_by", "first_name last_name")

				return {
					total: lastQuote ? 1 : 0,
					quotes: lastQuote ? [lastQuote] : [],
					page: 1,
					pageSize: 1,
				}
			}

			if (filters && Object.keys(filters).length > 0) {
				searchFilter.$and = Object.entries(filters).map(([key, value]) => {
					if (key === "quote_number") {
						return { [key]: Number(value) } // Convertir a número
					}
					if (key === "created_by" && mongoose.Types.ObjectId.isValid(value)) {
						return { [key]: new mongoose.Types.ObjectId(value) } // Convertir a ObjectId
					}
					return { [key]: { $regex: value, $options: "i" } } // Búsqueda en strings
				})
			}

			// 🔹 Filtro por rango de fechas
			if (startDate || endDate) {
				searchFilter.date = {}

				if (startDate) {
					const start = new Date(startDate)
					start.setUTCHours(0, 0, 0, 0) // ⏰ 00:00:00 en UTC
					searchFilter.date.$gte = start
				}

				if (endDate) {
					const end = new Date(endDate)
					end.setUTCHours(23, 59, 59, 999) // ⏰ 23:59:59 en UTC
					searchFilter.date.$lte = end
				}
			}

			// 🔹 Paginación
			const skip = (page - 1) * pageSize

			try {
				// 🔹 Consultar las cotizaciones con filtros y paginación
				const quotes = await Quotes.find(searchFilter)
					.sort({ created_at: -1 })
					.skip(skip)
					.limit(pageSize)
					.populate("article.article_number")
					.populate("created_by", "first_name last_name")

				// 🔹 Contar el total de documentos que coinciden con el filtro
				const total = await Quotes.countDocuments(searchFilter)

				return {
					total,
					quotes,
					page,
					pageSize,
				}
			} catch (error) {
				console.error("Error fetching quotes:", error)
				throw new Error("Failed to fetch quotes.")
			}
		},
	},

	Mutation: {
		// Create a new quote
		createQuote: async (
			_: any,
			{ input, avoidPipedrive }: { input: any; avoidPipedrive: boolean }
		) => {
			const total = input.article.reduce(
				(accumulator, currentValue) => accumulator + currentValue.total,
				0
			)
			try {
				const pipedrive_body: any = {
					title: input.project_name,
					value: total,
					currency: "USD",
					status: input.status,
					stage_id: pipedriveDirectory[input.quote_status],
					add_time: convertToTijuanaTime(input.date),
					owner_id: +input.created_by.pipedrive_id,
				}
				if (
					input.company_pipedrive_id &&
					input.company_pipedrive_id !== "NaN"
				) {
					Object.assign(pipedrive_body, {
						org_id: +input.company_pipedrive_id,
					})
				} else {
					if (!avoidPipedrive) {
						const created = await createOrganization({
							name: input.company,
							owner_id: +input.created_by.pipedrive_id,
						})
						Object.assign(pipedrive_body, {
							org_id: created.data.data.id,
						})
					}
				}

				if (
					input.company_contact.pipedrive_id &&
					input.company_contact.pipedrive_id !== "NaN"
				) {
					Object.assign(pipedrive_body, {
						person_id: +input.company_contact.pipedrive_id,
					})
				} else {
					if (!avoidPipedrive) {
						const created = await createPersonOrganization({
							name: input.company_contact.name,
							owner_id: +input.created_by.pipedrive_id,
							org_id: pipedrive_body.org_id,
							email: input.company_contact.email,
							phone_number: input.company_contact.mobile,
						})
						Object.assign(pipedrive_body, {
							person_id: created.data.data.id,
						})
					}
				}

				let formattedInput = {}

				if (!avoidPipedrive) {
					const pipedriveResponse = await axios.post(
						"https://api.pipedrive.com/api/v2/deals",
						pipedrive_body,
						{
							params: {
								api_token: process.env.PIPEDRIVE_API_KEY,
							},
						}
					)

					formattedInput = {
						...input,
						company_contact: {
							...input.company_contact,
							pipedrive_id:
								input.company_contact.pipedrive_id ??
								`${pipedrive_body.person_id}`,
						},
						company_pipedrive_id:
							input.company_pipedrive_id ?? `${pipedrive_body.org_id}`,
						pipedrive_id: pipedriveResponse.data.data.id,
						created_by: input.created_by.id,
					}
				} else {
					formattedInput = {
						...input,
						company_contact: {
							...input.company_contact,
							pipedrive_id:
								input.company_contact.pipedrive_id ??
								`${pipedrive_body.person_id}`,
						},
						company_pipedrive_id:
							input.company_pipedrive_id ?? `${pipedrive_body.org_id}`,
						pipedrive_id: null,
						created_by: input.created_by.id,
					}
				}

				const newQuote = await Quotes.create({
					...formattedInput,
					created_at: new Date(Date.now()),
					created_method: CreatedMethod.MANUAL,
				})
				return newQuote
			} catch (e) {
				console.log(e)
			}
		},

		// Update a quote by its ID
		updateQuote: async (
			_: any,
			{
				id,
				input,
				avoidPipedrive,
			}: { id: string; input: any; avoidPipedrive: boolean }
		) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const quote = await Quotes.findById(id)
			if (!quote) throw new Error("Quote not found")

			let formattedInput = {
				...input,
				created_by: input.created_by.id,
			}

			const total = input.article.reduce(
				(accumulator, currentValue) => accumulator + currentValue.total,
				0
			)

			const pipedrive_body: any = {
				title: input.project_name,
				value: total,
				currency: "USD",
				status: input.status,
				stage_id: pipedriveDirectory[input.quote_status],
				owner_id: +input.created_by.pipedrive_id,
			}

			if (input.company_pipedrive_id && input.company_pipedrive_id !== "NaN") {
				Object.assign(pipedrive_body, {
					org_id: +input.company_pipedrive_id,
				})
			} else {
				if (!avoidPipedrive) {
					const created = await createOrganization({
						name: input.company,
						owner_id: +input.created_by.pipedrive_id,
					})
					Object.assign(pipedrive_body, {
						org_id: created.data.data.id,
					})
				}
			}

			if (
				input.company_contact.pipedrive_id &&
				input.company_contact.pipedrive_id !== "NaN"
			) {
				Object.assign(pipedrive_body, {
					person_id: +input.company_contact.pipedrive_id,
				})
			} else {
				if (!avoidPipedrive) {
					const created = await createPersonOrganization({
						name: input.company_contact.name,
						owner_id: +input.created_by.pipedrive_id,
						org_id: pipedrive_body.org_id,
						email: input.company_contact.email,
						phone_number: input.company_contact.mobile,
					})
					Object.assign(pipedrive_body, {
						person_id: created.data.data.id,
					})
				}
			}

			if (!avoidPipedrive) {
				try {
					if (quote.pipedrive_id) {
						await updateQuote(quote.pipedrive_id, pipedrive_body)
					} else {
						const pipedriveResponse = await axios.post(
							"https://api.pipedrive.com/api/v2/deals",
							pipedrive_body,
							{
								params: {
									api_token: process.env.PIPEDRIVE_API_KEY,
								},
							}
						)
						formattedInput = {
							...formattedInput,
							pipedrive_id: pipedriveResponse.data.data.id,
						}
					}
				} catch (e) {
					console.log(e)
				}
			}

			const updatedQuote = await Quotes.findByIdAndUpdate(id, formattedInput, {
				new: true,
			})
				.populate("article.article_number")
				.populate("created_by", "first_name last_name")

			return updatedQuote
		},

		updateStatus: async (
			_: any,
			{ id, status }: { id: string; status: Status }
		) => {
			// Verificar que el ID sea válido
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			// Validar que el status recibido es uno de los valores permitidos en el enum
			if (!Object.values(Status).includes(status)) {
				throw new Error("Invalid status value")
			}

			// Verificar que la cotización existe
			const quote = await Quotes.findById(id)
			if (!quote) {
				throw new Error("Quote not found")
			}
			try {
				if (quote.pipedrive_id)
					await updateQuoteStatus(
						quote.pipedrive_id,
						pipedriveDirectory[status]
					)
			} catch (e) {
				console.log(e)
			}
			// Actualizar el estado de la cotización y devolver la cotización actualizada con los populate correspondientes
			const updatedQuote = await Quotes.findByIdAndUpdate(
				id,
				{ status },
				{ new: true }
			)
				.populate("article.article_number")
				.populate("created_by", "first_name last_name")

			return updatedQuote
		},

		updateQuoteStatus: async (
			_: any,
			{ id, quote_status }: { id: string; quote_status: QuoteStatus }
		) => {
			// Verificar que el ID sea válido
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			// Validar que el status recibido es uno de los valores permitidos en el enum
			if (!Object.values(QuoteStatus).includes(quote_status)) {
				throw new Error("Invalid status value")
			}

			// Verificar que la cotización existe
			const quote = await Quotes.findById(id)
			if (!quote) {
				throw new Error("Quote not found")
			}

			try {
				if (quote.pipedrive_id)
					await updateQuoteStage(
						quote.pipedrive_id,
						pipedriveDirectory[quote_status]
					)
			} catch (e) {
				throw new Error(e)
			}

			// Actualizar el estado de la cotización y devolver la cotización actualizada con los populate correspondientes
			const updatedQuote = await Quotes.findByIdAndUpdate(
				id,
				{ quote_status },
				{ new: true }
			)
				.populate("article.article_number")
				.populate("created_by", "first_name last_name")

			return updatedQuote
		},

		assignPipedriveDeal: async (
			_: any,
			{ id, pipedrive_id }: { id: string; pipedrive_id: string }
		) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			if (!pipedrive_id) {
				throw new Error("No pipedrive id provided")
			}

			const quote = await Quotes.findById(id).populate("created_by")

			if (!quote) {
				throw new Error("Quote not found")
			}

			const total = quote.article.reduce(
				(acc: number, item: any) => acc + item.total,
				0
			)

			const user = await Users.findById(quote.created_by)
			if (!user || !user.pipedrive_id) {
				throw new Error("El usuario creador no tiene pipedrive_id")
			}

			try {
				await getDealById(pipedrive_id)
			} catch (e) {
				throw new Error("Trato no encontrado en Pipedrive")
			}

			const pipedrive_body: any = {
				title: quote.project_name,
				value: total + (+quote.iva / 100) * total,
				currency: "USD",
				status: quote.status,
				stage_id: pipedriveDirectory[quote.quote_status],
				owner_id: +user.pipedrive_id,
			}

			if (quote.company_pipedrive_id && quote.company_pipedrive_id !== "NaN") {
				pipedrive_body.org_id = +quote.company_pipedrive_id
			}

			if (
				quote.company_contact?.pipedrive_id &&
				quote.company_contact.pipedrive_id !== "NaN"
			) {
				pipedrive_body.person_id = +quote.company_contact.pipedrive_id
			}

			try {
				await updateQuote(pipedrive_id, pipedrive_body)
			} catch (e) {
				console.error("Error updating deal in Pipedrive:", e)
				throw new Error("Failed to update deal in Pipedrive")
			}

			const updatedQuote = await Quotes.findByIdAndUpdate(
				id,
				{ pipedrive_id },
				{ new: true }
			)
				.populate("article.article_number")
				.populate("created_by", "first_name last_name")

			return updatedQuote
		},

		// Delete a quote by its ID
		deleteQuote: async (
			_: any,
			{ id, deletedBy }: { id: string; deletedBy: string }
		) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const quote = await Quotes.findById(id)
			if (!quote) throw new Error("Quote not found")

			if (quote.deleted_at) {
				throw new Error("Quote is already deleted")
			}

			await Quotes.findByIdAndUpdate(id, {
				deleted_at: new Date(),
				deleted_by: deletedBy,
			})

			return `Quote with ID ${id} has been soft deleted`
		},
	},
}
