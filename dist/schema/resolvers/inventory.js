"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryResolvers = void 0;
const inventory_1 = __importDefault(require("../../models/inventory"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.inventoryResolvers = {
    Query: {
        // Fetch an article by its ID, ensuring the ID is valid
        getArticleById: async (_, { id }) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const article = await inventory_1.default.findById(id);
            if (!article)
                throw new Error("Article not found");
            return article;
        },
        // Fetch all articles with optional pagination, sorting, and search functionality
        getAllArticles: async (_, { page = 1, pageSize = 10, sortBy = "created_at", sortOrder = "desc", searchField, searchValue, }) => {
            const sortDirection = sortOrder === "asc" ? 1 : -1;
            const searchFilter = searchField && searchValue
                ? {
                    [searchField]: { $regex: searchValue, $options: "i" },
                }
                : {};
            const skip = (page - 1) * pageSize;
            const articles = await inventory_1.default.find(searchFilter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize);
            const total = await inventory_1.default.countDocuments(searchFilter);
            return {
                total,
                articles,
                page,
                pageSize,
            };
        },
    },
    Mutation: {
        // Create a new article
        createArticle: async (_, { input }) => {
            const { article_number } = input;
            // Check if the article number already exists
            const existingArticle = await inventory_1.default.findOne({ article_number });
            if (existingArticle)
                throw new Error("Article number already exists");
            // Create and save the new article
            const newArticle = await inventory_1.default.create(input);
            return newArticle;
        },
        // Update an article by its ID
        updateArticle: async (_, { id, input }) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const article = await inventory_1.default.findById(id);
            if (!article)
                throw new Error("Article not found");
            const updatedArticle = await inventory_1.default.findByIdAndUpdate(id, input, {
                new: true,
            });
            return updatedArticle;
        },
        // Delete an article by its ID
        deleteArticle: async (_, { id }) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const article = await inventory_1.default.findById(id);
            if (!article)
                throw new Error("Article not found");
            await inventory_1.default.findByIdAndDelete(id);
            return `Article with ID ${id} has been deleted`;
        },
    },
};
//# sourceMappingURL=inventory.js.map