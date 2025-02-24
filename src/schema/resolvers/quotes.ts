import mongoose from "mongoose"
import Quotes, { QuotesType } from "../../models/quotes"

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
				searchField,
				searchValue,
				startDate,
				endDate,
			}: {
				page: number
				pageSize: number
				sortBy: string
				sortOrder: string
				searchField?: keyof QuotesType
				searchValue?: string
				startDate?: string
				endDate?: string
			}
		) => {
			const sortDirection = sortOrder === "asc" ? 1 : -1

			const searchFilter: any =
				searchField && searchValue
					? {
							[searchField]: { $regex: searchValue, $options: "i" },
						}
					: {}

			if (startDate && endDate) {
				searchFilter.date = {
					$gte: new Date(startDate),
					$lte: new Date(endDate),
				}
			} else if (startDate) {
				searchFilter.date = { $gte: new Date(startDate) }
			} else if (endDate) {
				searchFilter.date = { $lte: new Date(endDate) }
			}

			const skip = (page - 1) * pageSize

			const quotes = await Quotes.find(searchFilter)
				.sort({ [sortBy]: sortDirection })
				.skip(skip)
				.limit(pageSize)
				.populate("article.article_number")
				.populate("created_by", "first_name last_name")

			const total = await Quotes.countDocuments(searchFilter)

			return {
				total,
				quotes,
				page,
				pageSize,
			}
		},
	},

	Mutation: {
		// Create a new quote
		createQuote: async (_: any, { input }: { input: any }) => {
			console.log(input.created_by.id)

			const formattedInput = {
				...input,
				created_by: input.created_by.id,
			}

			const newQuote = await Quotes.create(formattedInput)
			return newQuote
		},

		// Update a quote by its ID
		updateQuote: async (_: any, { id, input }: { id: string; input: any }) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const quote = await Quotes.findById(id)
			if (!quote) throw new Error("Quote not found")

			const formattedInput = {
				...input,
				created_by: input.created_by.id,
			}

			const updatedQuote = await Quotes.findByIdAndUpdate(id, formattedInput, {
				new: true,
			})
				.populate("article.article_number")
				.populate("created_by", "first_name last_name")

			return updatedQuote
		},

		// Delete a quote by its ID
		deleteQuote: async (_: any, { id }: { id: string }) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const quote = await Quotes.findById(id)
			if (!quote) throw new Error("Quote not found")

			await Quotes.findByIdAndDelete(id)

			return `Quote with ID ${id} has been deleted`
		},
	},
}
