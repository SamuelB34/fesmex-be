"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersResolvers = void 0;
const users_1 = __importStar(require("../../models/users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.usersResolvers = {
    Query: {
        // Fetch a user by their ID, ensuring the ID is valid and the user is not soft-deleted
        getUserById: async (_, { id }) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const user = await users_1.default.findOne({
                _id: id,
                deleted_at: { $exists: false },
            });
            if (!user)
                throw new Error("User not found");
            return {
                id: user._id,
                username: user.username,
                first_name: user.first_name,
                middle_name: user.middle_name || "",
                last_name: user.last_name,
                authenticated: user.authenticated,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                created_at: user.created_at,
                created_by: user.created_by,
            };
        },
        // Fetch all users with optional pagination, sorting, and search functionality
        getAllUsers: async (_, { page = 1, pageSize = 10, sortBy = "created_at", sortOrder = "desc", searchField, searchValue, }) => {
            // Determine the sort direction based on sortOrder
            const sortDirection = sortOrder === "asc" ? 1 : -1;
            // Build a search filter if search parameters are provided
            const searchFilter = searchField && searchValue
                ? {
                    [searchField]: { $regex: searchValue, $options: "i" },
                }
                : {};
            // Calculate the number of documents to skip for pagination
            const skip = (page - 1) * pageSize;
            // Fetch users with the specified filters, sorting, and pagination
            const users = await users_1.default.find(Object.assign({ deleted_at: { $exists: false } }, searchFilter))
                .sort({ [sortBy]: sortDirection }) // Apply sorting
                .skip(skip) // Skip documents for pagination
                .limit(pageSize); // Limit the number of results
            // Count the total number of users matching the filters
            const total = await users_1.default.countDocuments(Object.assign({ deleted_at: { $exists: false } }, searchFilter));
            return {
                total,
                users,
                page,
                pageSize,
            };
        },
    },
    Mutation: {
        // Create a new user, hashing their password and ensuring uniqueness
        createUser: async (_, { input }) => {
            const { username, first_name, last_name, password, role } = input;
            // Check if the username already exists
            const usernameExists = await users_1.default.findOne({
                username,
                deleted_at: { $exists: false },
            });
            if (usernameExists)
                throw new Error("Username already exists");
            // Check if a user with the same name already exists
            const duplicateName = await users_1.default.findOne({
                first_name,
                last_name,
                deleted_at: { $exists: false },
            });
            if (duplicateName)
                throw new Error("User already exists");
            // Hash the password before saving
            const hashedPassword = bcrypt_1.default.hashSync(password, 12);
            // Create and save the new user
            const newUser = await users_1.default.create(Object.assign(Object.assign({}, input), { password: hashedPassword, authenticated: false, created_at: new Date(Date.now()), created_by: "Admin", role: role || users_1.UserRole.SALES }));
            return newUser;
        },
        // Update user details based on provided input fields
        updateUser: async (_, { id, input }) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const user = await users_1.default.findOne({
                _id: id,
                deleted_at: { $exists: false },
            });
            if (!user)
                throw new Error("User not found");
            const updatedFields = {};
            if (input.username) {
                const usernameExists = await users_1.default.findOne({
                    username: input.username,
                    deleted_at: { $exists: false },
                });
                if (usernameExists)
                    throw new Error("Username already exists");
                updatedFields.username = input.username;
            }
            if (input.first_name)
                updatedFields.first_name = input.first_name;
            if (input.middle_name)
                updatedFields.middle_name = input.middle_name;
            if (input.last_name)
                updatedFields.last_name = input.last_name;
            if (input.role)
                updatedFields.role = input.role;
            if (input.email)
                updatedFields.email = input.email;
            if (input.mobile)
                updatedFields.mobile = input.mobile;
            if (input.authenticated !== undefined)
                updatedFields.authenticated = input.authenticated;
            updatedFields.updated_at = new Date(Date.now());
            // Update the user and return the new document
            const updatedUser = await users_1.default.findByIdAndUpdate(id, updatedFields, {
                new: true,
            });
            return updatedUser;
        },
        // Soft-delete a user by setting the deleted_at field
        deleteUser: async (_, { id }) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const user = await users_1.default.findOne({
                _id: id,
                deleted_at: { $exists: false },
            });
            if (!user)
                throw new Error("User not found");
            await users_1.default.findByIdAndUpdate(id, {
                authenticated: false,
                deleted_at: new Date(Date.now()),
                deleted_by: "Admin",
            });
            return `User with ID ${id} has been deleted`;
        },
        // Authenticate a user by verifying their username and password
        login: async (_, { input }) => {
            const { username, password } = input;
            const user = await users_1.default.findOne({
                username,
                deleted_at: { $exists: false },
            });
            if (!user)
                throw new Error("Invalid username or password");
            // Verify the hashed password
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid)
                throw new Error("Invalid username or password");
            // Generate a JWT token with user details
            const payload = {
                user_id: user._id.toString(),
                user_username: user.username,
                user_role: user.role,
            };
            const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
            return { id: user._id, jwt: token };
        },
    },
};
//# sourceMappingURL=users.js.map