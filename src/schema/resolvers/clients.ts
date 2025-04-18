import Clients, { ClientType } from "../../models/clients"
import mongoose from "mongoose"
import Quotes from "../../models/quotes"

export const clientResolvers = {
	Query: {
		// Fetch a client by its ID, ensuring the ID is valid
		getClientById: async (_: any, { id }: { id: string }) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const client = await Clients.findById(id)
			if (!client) throw new Error("Client not found")

			return client
		},

		// Fetch all clients with optional pagination, sorting, and search functionality
		getAllClients: async (
			_: any,
			{
				page = 1,
				pageSize = 10,
				sortBy = "created_at",
				sortOrder = "desc",
				filters = {},
				startDate,
				endDate,
			}: {
				page: number
				pageSize: number
				sortBy: string
				sortOrder: string
				filters?: Record<string, any> // Permitir múltiples filtros dinámicos
				startDate?: string
				endDate?: string
			}
		) => {
			const sortDirection = sortOrder === "asc" ? 1 : -1
			const searchFilter: any = {
				deleted_at: { $exists: false },
			}

			// 🔹 Aplicar filtros dinámicos
			if (filters && Object.keys(filters).length > 0) {
				searchFilter.$and = Object.entries(filters).map(([key, value]) => {
					if (key === "sn_code") {
						return { [key]: Number(value) } // Convertir a número si aplica
					}
					if (key === "sales_department_employee_code") {
						return { [key]: { $regex: value, $options: "i" } } // Búsqueda insensible a mayúsculas/minúsculas
					}
					if (key === "created_by" && mongoose.Types.ObjectId.isValid(value)) {
						return { [key]: new mongoose.Types.ObjectId(value) } // Convertir a ObjectId si aplica
					}
					return { [key]: { $regex: value, $options: "i" } } // Búsqueda en strings
				})
			}

			// 🔹 Filtro por rango de fechas si es necesario
			if (startDate || endDate) {
				searchFilter.created_at = {}

				if (startDate) {
					const start = new Date(startDate)
					start.setUTCHours(0, 0, 0, 0) // ⏰ 00:00:00 en UTC
					searchFilter.created_at.$gte = start
				}

				if (endDate) {
					const end = new Date(endDate)
					end.setUTCHours(23, 59, 59, 999) // ⏰ 23:59:59 en UTC
					searchFilter.created_at.$lte = end
				}
			}

			// 🔹 Paginación
			const skip = (page - 1) * pageSize

			try {
				// 🔹 Consultar clientes con filtros y paginación
				const clients = await Clients.find(searchFilter)
					.sort({ [sortBy]: sortDirection })
					.skip(skip)
					.limit(pageSize)

				// 🔹 Contar el total de documentos que coinciden con el filtro
				const total = await Clients.countDocuments(searchFilter)

				return {
					total,
					clients,
					page,
					pageSize,
				}
			} catch (error) {
				console.error("Error fetching clients:", error)
				throw new Error("Failed to fetch clients.")
			}
		},
	},

	Mutation: {
		// Create a new client
		createClient: async (_: any, { input }: { input: ClientType }) => {
			const { sn_code, sn_name } = input

			// Check if the client code already exists
			const existingClient = await Clients.findOne({ sn_code })
			if (existingClient) throw new Error("Client code already exists")

			// Check if the client code already exists
			const existingClientName = await Clients.findOne({
				sn_name: { $regex: `^${sn_name}$`, $options: "i" },
			})
			if (existingClientName) throw new Error("Client name already exists")

			// Create and save the new client
			const newClient = await Clients.create(input)

			return newClient
		},

		// Update a client by its ID
		updateClient: async (
			_: any,
			{ id, input }: { id: string; input: Partial<ClientType> }
		) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const client = await Clients.findById(id)
			if (!client) throw new Error("Client not found")

			const updatedClient = await Clients.findByIdAndUpdate(id, input, {
				new: true,
			})

			return updatedClient
		},

		// Delete a client by its ID
		deleteClient: async (
			_: any,
			{ id, deletedBy }: { id: string; deletedBy: string }
		) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const client = await Clients.findById(id)
			if (!client) throw new Error("Client not found")
			await Clients.findByIdAndUpdate(id, {
				deleted_at: new Date(),
				deleted_by: deletedBy,
			})

			return `Client with ID ${id} has been deleted`
		},
	},
}
