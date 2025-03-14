"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementsResolvers = void 0;
const announcement_1 = __importDefault(require("../../models/announcement"));
const mongoose_1 = __importDefault(require("mongoose"));
const jwt = require("jsonwebtoken");
exports.announcementsResolvers = {
    Query: {
        // Fetch an announcement (one or more) based on ID or pagination filters
        getAnnouncements: async (_, { id, // optional ID for fetching a single announcement
        page = 1, pageSize = 10, sortBy = "created_at", sortOrder = "desc", searchField, searchValue, }, context // Context where token is passed
        ) => {
            const user = context.user;
            if (!user)
                throw new Error("Unauthorized");
            if (id) {
                // Fetch a single announcement by ID if provided
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    throw new Error("Invalid ID");
                }
                const announcement = await announcement_1.default.findOne({
                    _id: id,
                    deleted_at: { $exists: false },
                    roles: { $in: [user.role] },
                })
                    .populate({
                    path: "created_by",
                    select: "first_name last_name",
                })
                    .populate({
                    path: "updated_by",
                    select: "first_name last_name",
                });
                if (!announcement)
                    throw new Error("Announcement not found");
                const total = await announcement_1.default.countDocuments({
                    _id: id,
                    deleted_at: { $exists: false },
                    roles: { $in: [user.role] },
                });
                const announcements = [announcement];
                return {
                    total,
                    announcements,
                    page,
                    pageSize,
                };
            }
            else {
                // Fetch multiple announcements with pagination and sorting if no ID is provided
                const sortDirection = sortOrder === "asc" ? 1 : -1;
                // Build a search filter if search parameters are provided
                const searchFilter = searchField && searchValue
                    ? {
                        [searchField]: { $regex: searchValue, $options: "i" },
                    }
                    : {};
                // Calculate the number of documents to skip for pagination
                const skip = (page - 1) * pageSize;
                // Fetch announcements with the specified filters, sorting, and pagination
                const announcements = await announcement_1.default.find(Object.assign(Object.assign({ deleted_at: { $exists: false } }, searchFilter), { roles: { $in: [user.role] } }))
                    .sort({ [sortBy]: sortDirection }) // Apply sorting
                    .skip(skip) // Skip documents for pagination
                    .limit(pageSize) // Limit the number of results
                    .populate({
                    path: "created_by",
                    select: "first_name last_name",
                })
                    .populate({
                    path: "updated_by",
                    select: "first_name last_name",
                });
                // Count the total number of announcements matching the filters
                const total = await announcement_1.default.countDocuments(Object.assign(Object.assign({ deleted_at: { $exists: false } }, searchFilter), { roles: { $in: [user.role] } }));
                return {
                    total,
                    announcements,
                    page,
                    pageSize,
                };
            }
        },
    },
    Mutation: {
        // Create a new announcement
        createAnnouncement: async (_, { input }, context) => {
            const user = context.user; // Obtener el usuario desde el token
            if (!user || user.role !== "admin")
                throw new Error("Unauthorized");
            const { title, text, roles } = input;
            const newAnnouncement = await announcement_1.default.create(Object.assign(Object.assign({}, input), { created_at: new Date(Date.now()), created_by: user.id }));
            return newAnnouncement;
        },
        // Update an existing announcement
        updateAnnouncement: async (_, { id, input }, context) => {
            const user = context.user; // Obtener el usuario desde el token
            if (!user || user.role !== "admin")
                throw new Error("Unauthorized");
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const announcement = await announcement_1.default.findOne({
                _id: id,
                deleted_at: { $exists: false },
            });
            if (!announcement)
                throw new Error("Announcement not found");
            const updatedFields = {};
            if (input.title)
                updatedFields.title = input.title;
            if (input.text)
                updatedFields.text = input.text;
            if (input.roles)
                updatedFields.roles = input.roles;
            updatedFields.updated_at = new Date(Date.now());
            updatedFields.updated_by = user.id;
            // Update the announcement and return the updated document
            const updatedAnnouncement = await announcement_1.default.findByIdAndUpdate(id, updatedFields, {
                new: true,
            })
                .populate({
                path: "created_by",
                select: "first_name last_name",
            })
                .populate({
                path: "updated_by",
                select: "first_name last_name",
            });
            return updatedAnnouncement;
        },
        // Soft-delete an announcement by setting the deleted_at field
        deleteAnnouncement: async (_, { id }, context) => {
            const user = context.user;
            if (!user || user.role !== "admin")
                throw new Error("Unauthorized");
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const announcement = await announcement_1.default.findOne({
                _id: id,
                deleted_at: { $exists: false },
            });
            if (!announcement)
                throw new Error("Announcement not found");
            await announcement_1.default.findByIdAndUpdate(id, {
                deleted_at: new Date(Date.now()),
                deleted_by: user.id,
            });
            return `Announcement with ID ${id} has been deleted`;
        },
    },
};
//# sourceMappingURL=announcements.js.map