import User, { UserRole } from "../../models/users"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

export const usersResolvers = {
	Query: {
		// Fetch a user by their ID, ensuring the ID is valid and the user is not soft-deleted
		getUserById: async (_: any, { id }: { id: string }) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const user = await User.findOne({
				_id: id,
				deleted_at: { $exists: false },
			})
			if (!user) throw new Error("User not found")

			return {
				id: user._id,
				username: user.username,
				first_name: user.first_name,
				middle_name: user.middle_name || "",
				last_name: user.last_name,
				authenticated: user.authenticated,
				email: user.email,
				mobile: user.mobile,
				pipedrive_id: user.pipedrive_id,
				role: user.role,
				created_at: user.created_at,
				created_by: user.created_by,
			}
		},

		// Fetch all users with optional pagination, sorting, and search functionality
		getAllUsers: async (
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
				searchField: string
				searchValue: string
			}
		) => {
			// Determine the sort direction based on sortOrder
			const sortDirection = sortOrder === "asc" ? 1 : -1

			// Build a search filter if search parameters are provided
			const searchFilter =
				searchField && searchValue
					? {
							[searchField]: { $regex: searchValue, $options: "i" },
						}
					: {}

			// Calculate the number of documents to skip for pagination
			const skip = (page - 1) * pageSize

			// Fetch users with the specified filters, sorting, and pagination
			const users = await User.find({
				deleted_at: { $exists: false },
				...searchFilter,
			})
				.sort({ [sortBy]: sortDirection }) // Apply sorting
				.skip(skip) // Skip documents for pagination
				.limit(pageSize) // Limit the number of results

			// Count the total number of users matching the filters
			const total = await User.countDocuments({
				deleted_at: { $exists: false },
				...searchFilter,
			})

			return {
				total,
				users,
				page,
				pageSize,
			}
		},
	},

	Mutation: {
		// Create a new user, hashing their password and ensuring uniqueness
		createUser: async (_: any, { input }: { input: any }) => {
			const { username, first_name, last_name, password, role } = input

			// Check if the username already exists
			const usernameExists = await User.findOne({
				username,
				deleted_at: { $exists: false },
			})
			if (usernameExists) throw new Error("Username already exists")

			// Check if a user with the same name already exists
			const duplicateName = await User.findOne({
				first_name,
				last_name,
				deleted_at: { $exists: false },
			})
			if (duplicateName) throw new Error("User already exists")

			// Hash the password before saving
			const hashedPassword = bcrypt.hashSync(password, 12)

			// Create and save the new user
			const newUser = await User.create({
				...input,
				password: hashedPassword,
				authenticated: false,
				created_at: new Date(Date.now()),
				created_by: "Admin",
				role: role || UserRole.SALES,
			})

			return newUser
		},

		// Update user details based on provided input fields
		updateUser: async (_: any, { id, input }: { id: string; input: any }) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const user = await User.findOne({
				_id: id,
				deleted_at: { $exists: false },
			})
			if (!user) throw new Error("User not found")

			const updatedFields: any = {}

			if (input.username) {
				const usernameExists = await User.findOne({
					username: input.username,
					deleted_at: { $exists: false },
				})
				if (usernameExists) throw new Error("Username already exists")

				updatedFields.username = input.username
			}

			if (input.first_name) updatedFields.first_name = input.first_name
			if (input.middle_name) updatedFields.middle_name = input.middle_name
			if (input.last_name) updatedFields.last_name = input.last_name
			if (input.role) updatedFields.role = input.role
			if (input.email) updatedFields.email = input.email
			if (input.mobile) updatedFields.mobile = input.mobile
			if (input.authenticated !== undefined)
				updatedFields.authenticated = input.authenticated

			updatedFields.updated_at = new Date(Date.now())

			// Update the user and return the new document
			const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
				new: true,
			})

			return updatedUser
		},

		// Soft-delete a user by setting the deleted_at field
		deleteUser: async (_: any, { id }: { id: string }) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid ID")
			}

			const user = await User.findOne({
				_id: id,
				deleted_at: { $exists: false },
			})
			if (!user) throw new Error("User not found")

			await User.findByIdAndUpdate(id, {
				authenticated: false,
				deleted_at: new Date(Date.now()),
				deleted_by: "Admin",
			})

			return `User with ID ${id} has been deleted`
		},

		// Authenticate a user by verifying their username and password
		login: async (_: any, { input }: { input: any }) => {
			const { username, password } = input

			const user = await User.findOne({
				username,
				deleted_at: { $exists: false },
			})
			if (!user) throw new Error("Invalid username or password")

			// Verify the hashed password
			const isPasswordValid = await bcrypt.compare(password, user.password)
			if (!isPasswordValid) throw new Error("Invalid username or password")

			// Generate a JWT token with user details
			const payload = {
				user_id: user._id.toString(),
				user_username: user.username,
				user_role: user.role,
			}

			const token = jwt.sign(payload, process.env.JWT_SECRET as string)

			return { id: user._id, jwt: token }
		},
	},
}
