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
				sortBy = "created_at",
				sortOrder = "desc",
				searchField,
				searchValue,
			}: {
				page: number
				pageSize: number
				sortBy: string
				sortOrder: string
				searchField?: keyof ArticleType
				searchValue?: string
			}
		) => {
			const sortDirection = sortOrder === "asc" ? 1 : -1

			const searchFilter =
				searchField && searchValue
					? {
							[searchField]: { $regex: searchValue, $options: "i" },
						}
					: {}

			const skip = (page - 1) * pageSize

			const articles = await Inventory.find(searchFilter)
				.sort({ [sortBy]: sortDirection })
				.skip(skip)
				.limit(pageSize)

			const total = await Inventory.countDocuments(searchFilter)

			return {
				total,
				articles,
				page,
				pageSize,
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
