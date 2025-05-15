import Inventory, { ArticleType, Currency, Group } from "../../models/inventory"
import mongoose from "mongoose"

export const inventoryResolvers = {
	Query: {
		// Fetch an article by its ID, ensuring the ID is valid
		getArticleById: async (_: any, { id }: { id: string }) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const article = await Inventory.findById(id)
			if (!article) throw new Error("Article not found")

			return article
		},

		// Fetch all articles with optional pagination, sorting, and search functionality
		getAllArticles: async (
			_: any,
			{
				page = 1,
				pageSize = 10,
				sortBy = "brand",
				sortOrder = "asc",
				filters = {},
			}: {
				page: number
				pageSize: number
				sortBy: string
				sortOrder: string
				filters?: Record<string, any>
			}
		) => {
			const sortDirection = sortOrder === "asc" ? 1 : -1
			const searchFilter: any = {}

			try {
				// 🔹 Aplicar filtros dinámicos
				if (filters && Object.keys(filters).length > 0) {
					searchFilter.$and = Object.entries(filters).map(([key, value]) => {
						return { [key]: { $regex: value, $options: "i" } }
					})
				}

				// 🔹 Paginación
				const skip = (page - 1) * pageSize

				// 🔹 Obtener artículos sin `created_at` ni `updated_at`
				const articles = await Inventory.find(searchFilter)
					.sort({ [sortBy]: sortDirection })
					.skip(skip)
					.limit(pageSize)
					.exec()

				// 🔹 Contar total de documentos
				const total = await Inventory.countDocuments(searchFilter)

				return {
					total,
					articles,
					page,
					pageSize,
				}
			} catch (error) {
				console.error("Error al obtener artículos:", error)
				throw new Error(`Failed to fetch articles: ${error.message}`)
			}
		},
	},

	Mutation: {
		// Create a new article
		createArticle: async (_: any, { input }: { input: ArticleType }) => {
			const { article_number } = input

			// Check if the article number already exists
			const existingArticle = await Inventory.findOne({ article_number })
			if (existingArticle) throw new Error("Article number already exists")

			// Create and save the new article
			const newArticle = await Inventory.create(input)

			return newArticle
		},

		// Update an article by its ID
		updateArticle: async (
			_: any,
			{ id, input }: { id: string; input: Partial<ArticleType> }
		) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const article = await Inventory.findById(id)
			if (!article) throw new Error("Article not found")

			const updatedArticle = await Inventory.findByIdAndUpdate(id, input, {
				new: true,
			})

			return updatedArticle
		},

		// Delete an article by its ID
		deleteArticle: async (_: any, { id }: { id: string }) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const article = await Inventory.findById(id)
			if (!article) throw new Error("Article not found")

			await Inventory.findByIdAndDelete(id)

			return `Article with ID ${id} has been deleted`
		},
	},
}
