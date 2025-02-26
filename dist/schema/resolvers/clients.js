"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientResolvers = void 0;
const clients_1 = __importDefault(require("../../models/clients"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.clientResolvers = {
    Query: {
        // Fetch a client by its ID, ensuring the ID is valid
        getClientById: async (_, { id }) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const client = await clients_1.default.findById(id);
            if (!client)
                throw new Error("Client not found");
            return client;
        },
        // Fetch all clients with optional pagination, sorting, and search functionality
        getAllClients: async (_, { page = 1, pageSize = 10, sortBy = "created_at", sortOrder = "desc", searchField, searchValue, }) => {
            const sortDirection = sortOrder === "asc" ? 1 : -1;
            const searchFilter = searchField && searchValue
                ? {
                    [searchField]: { $regex: searchValue, $options: "i" },
                }
                : {};
            const skip = (page - 1) * pageSize;
            const clients = await clients_1.default.find(searchFilter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize);
            const total = await clients_1.default.countDocuments(searchFilter);
            return {
                total,
                clients,
                page,
                pageSize,
            };
        },
    },
    Mutation: {
        // Create a new client
        createClient: async (_, { input }) => {
            const { sn_code } = input;
            // Check if the client code already exists
            const existingClient = await clients_1.default.findOne({ sn_code });
            if (existingClient)
                throw new Error("Client code already exists");
            // Create and save the new client
            const newClient = await clients_1.default.create(input);
            return newClient;
        },
        // Update a client by its ID
        updateClient: async (_, { id, input }) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const client = await clients_1.default.findById(id);
            if (!client)
                throw new Error("Client not found");
            const updatedClient = await clients_1.default.findByIdAndUpdate(id, input, {
                new: true,
            });
            return updatedClient;
        },
        // Delete a client by its ID
        deleteClient: async (_, { id }) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const client = await clients_1.default.findById(id);
            if (!client)
                throw new Error("Client not found");
            await clients_1.default.findByIdAndDelete(id);
            return `Client with ID ${id} has been deleted`;
        },
    },
};
//# sourceMappingURL=clients.js.map