import Announcement from "../../models/announcement"
import mongoose from "mongoose"
const jwt = require("jsonwebtoken")

export const announcementsResolvers = {
	Query: {
		// Fetch an announcement (one or more) based on ID or pagination filters
		getAnnouncements: async (
			_: any,
			{
				id, // optional ID for fetching a single announcement
				page = 1,
				pageSize = 10,
				sortBy = "created_at",
				sortOrder = "desc",
				searchField,
				searchValue,
			}: {
				id?: string // Optional ID for fetching a single announcement
				page: number
				pageSize: number
				sortBy: string
				sortOrder: string
				searchField: string
				searchValue: string
			},
			context: any // Context where token is passed
		) => {
			const user = context.user
			if (!user) throw new Error("Unauthorized")

			const isAdmin = user.role === "admin" // Verifica si el usuario es admin

			if (id) {
				// Fetch a single announcement by ID if provided
				if (!mongoose.Types.ObjectId.isValid(id)) {
					throw new Error("Invalid ID")
				}

				const queryFilter: any = {
					_id: id,
					deleted_at: { $exists: false },
				}

				// Si NO es admin, aplicar el filtro de roles
				if (!isAdmin) {
					queryFilter.roles = { $in: [user.role] }
				}

				const announcement = await Announcement.findOne(queryFilter)
					.populate({
						path: "created_by",
						select: "first_name last_name",
					})
					.populate({
						path: "updated_by",
						select: "first_name last_name",
					})

				if (!announcement) throw new Error("Announcement not found")

				return {
					total: 1,
					announcements: [announcement],
					page,
					pageSize,
				}
			} else {
				// Fetch multiple announcements with pagination and sorting if no ID is provided
				const sortDirection = sortOrder === "asc" ? 1 : -1

				// Construir filtro de búsqueda si se proporcionan parámetros de búsqueda
				const searchFilter =
					searchField && searchValue
						? { [searchField]: { $regex: searchValue, $options: "i" } }
						: {}

				// Filtro base
				const queryFilter: any = {
					deleted_at: { $exists: false },
					...searchFilter,
				}

				// Si NO es admin, aplicar el filtro de roles
				if (!isAdmin) {
					queryFilter.roles = { $in: [user.role] }
				}

				// Calcular la cantidad de documentos a omitir para la paginación
				const skip = (page - 1) * pageSize

				// Buscar los anuncios con los filtros, orden y paginación
				const announcements = await Announcement.find(queryFilter)
					.sort({ [sortBy]: sortDirection })
					.skip(skip)
					.limit(pageSize)
					.populate({
						path: "created_by",
						select: "first_name last_name",
					})
					.populate({
						path: "updated_by",
						select: "first_name last_name",
					})

				// Contar el total de documentos que coinciden con el filtro
				const total = await Announcement.countDocuments(queryFilter)

				return {
					total,
					announcements,
					page,
					pageSize,
				}
			}
		},
	},

	Mutation: {
		// Create a new announcement
		createAnnouncement: async (
			_: any,
			{ input }: { input: any },
			context: any
		) => {
			const user = context.user // Obtener el usuario desde el token
			if (!user || user.role !== "admin") throw new Error("Unauthorized")

			const { title, text, roles } = input

			const newAnnouncement = await Announcement.create({
				...input,
				created_at: new Date(Date.now()),
				created_by: user.id,
			})

			return newAnnouncement
		},

		// Update an existing announcement
		updateAnnouncement: async (
			_: any,
			{ id, input }: { id: string; input: any },
			context: any
		) => {
			const user = context.user // Obtener el usuario desde el token
			if (!user || user.role !== "admin") throw new Error("Unauthorized")

			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const announcement = await Announcement.findOne({
				_id: id,
				deleted_at: { $exists: false },
			})
			if (!announcement) throw new Error("Announcement not found")

			const updatedFields: any = {}

			if (input.title) updatedFields.title = input.title
			if (input.text) updatedFields.text = input.text
			if (input.roles) updatedFields.roles = input.roles

			updatedFields.updated_at = new Date(Date.now())
			updatedFields.updated_by = user.id

			// Update the announcement and return the updated document
			const updatedAnnouncement = await Announcement.findByIdAndUpdate(
				id,
				updatedFields,
				{
					new: true,
				}
			)
				.populate({
					path: "created_by",
					select: "first_name last_name",
				})
				.populate({
					path: "updated_by",
					select: "first_name last_name",
				})

			return updatedAnnouncement
		},

		// Soft-delete an announcement by setting the deleted_at field
		deleteAnnouncement: async (
			_: any,
			{ id }: { id: string },
			context: any
		) => {
			const user = context.user
			if (!user || user.role !== "admin") throw new Error("Unauthorized")

			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const announcement = await Announcement.findOne({
				_id: id,
				deleted_at: { $exists: false },
			})
			if (!announcement) throw new Error("Announcement not found")

			await Announcement.findByIdAndUpdate(id, {
				deleted_at: new Date(Date.now()),
				deleted_by: user.id,
			})

			return `Announcement with ID ${id} has been deleted`
		},
	},
}
