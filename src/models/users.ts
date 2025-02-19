import mongoose, { model } from "mongoose"

export enum UserRole {
	ADMIN = "admin",
	SALES = "sales",
	TECHNICIAN = "technician",
	WAREHOUSEMAN = "warehouseman",
}

export interface UserType {
	first_name: string
	middle_name?: string
	last_name: string
	username: string
	password: string
	role: UserRole
	authenticated: boolean
	email?: string
	mobile?: string

	created_at: Date
	created_by: string
	updated_at?: Date
	updated_by?: string
	deleted_at?: Date
	deleted_by?: string
}

const usersSchema = new mongoose.Schema<UserType>({
	first_name: { type: String, required: true },
	middle_name: { type: String },
	last_name: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
	role: {
		type: String,
		enum: Object.values(UserRole),
		required: true,
		default: UserRole.SALES,
	},
	authenticated: { type: Boolean, required: true, default: false },
	email: { type: String },
	mobile: { type: String },

	created_at: { type: Date, required: true, default: Date.now },
	created_by: { type: String, required: true },
	updated_at: { type: Date },
	updated_by: { type: String },
	deleted_at: { type: Date },
	deleted_by: { type: String },
})

const User = model<UserType>("Users", usersSchema)

export default User
