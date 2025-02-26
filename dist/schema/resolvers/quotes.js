"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotesResolvers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const quotes_1 = __importDefault(require("../../models/quotes"));
exports.quotesResolvers = {
    Query: {
        // Fetch a quote by its ID
        getQuoteById: async (_, { id }) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const quote = await quotes_1.default.findById(id)
                .populate("article.article_number")
                .populate("created_by", "first_name last_name");
            if (!quote)
                throw new Error("Quote not found");
            return quote;
        },
        getAllQuotes: async (_, { page = 1, pageSize = 10, sortBy = "date", sortOrder = "desc", searchField, searchValue, startDate, endDate, }) => {
            const sortDirection = sortOrder === "asc" ? 1 : -1;
            const searchFilter = searchField && searchValue
                ? {
                    [searchField]: { $regex: searchValue, $options: "i" },
                }
                : {};
            if (startDate && endDate) {
                searchFilter.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }
            else if (startDate) {
                searchFilter.date = { $gte: new Date(startDate) };
            }
            else if (endDate) {
                searchFilter.date = { $lte: new Date(endDate) };
            }
            const skip = (page - 1) * pageSize;
            const quotes = await quotes_1.default.find(searchFilter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .populate("article.article_number")
                .populate("created_by", "first_name last_name");
            const total = await quotes_1.default.countDocuments(searchFilter);
            return {
                total,
                quotes,
                page,
                pageSize,
            };
        },
    },
    Mutation: {
        // Create a new quote
        createQuote: async (_, { input }) => {
            console.log(input.created_by.id);
            const formattedInput = Object.assign(Object.assign({}, input), { created_by: input.created_by.id });
            const newQuote = await quotes_1.default.create(formattedInput);
            return newQuote;
        },
        // Update a quote by its ID
        updateQuote: async (_, { id, input }) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const quote = await quotes_1.default.findById(id);
            if (!quote)
                throw new Error("Quote not found");
            const formattedInput = Object.assign(Object.assign({}, input), { created_by: input.created_by.id });
            const updatedQuote = await quotes_1.default.findByIdAndUpdate(id, formattedInput, {
                new: true,
            })
                .populate("article.article_number")
                .populate("created_by", "first_name last_name");
            return updatedQuote;
        },
        // Delete a quote by its ID
        deleteQuote: async (_, { id }) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const quote = await quotes_1.default.findById(id);
            if (!quote)
                throw new Error("Quote not found");
            await quotes_1.default.findByIdAndDelete(id);
            return `Quote with ID ${id} has been deleted`;
        },
    },
};
//# sourceMappingURL=quotes.js.map