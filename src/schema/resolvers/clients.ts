import Clients, { ClientType } from "../../models/clients"
import mongoose from "mongoose"

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
				searchField,
				searchValue,
			}: {
				page: number
				pageSize: number
				sortBy: string
				sortOrder: string
				searchField?: keyof ClientType
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

			const clients = await Clients.find(searchFilter)
				.sort({ [sortBy]: sortDirection })
				.skip(skip)
				.limit(pageSize)

			const total = await Clients.countDocuments(searchFilter)

			return {
				total,
				clients,
				page,
				pageSize,
			}
		},
	},

	Mutation: {
		// Create a new client
		createClient: async (_: any, { input }: { input: ClientType }) => {
			const { sn_code } = input

			// Check if the client code already exists
			const existingClient = await Clients.findOne({ sn_code })
			if (existingClient) throw new Error("Client code already exists")

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
		deleteClient: async (_: any, { id }: { id: string }) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const client = await Clients.findById(id)
			if (!client) throw new Error("Client not found")

			await Clients.findByIdAndDelete(id)

			return `Client with ID ${id} has been deleted`
		},
	},
}
