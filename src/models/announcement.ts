import mongoose, { model, Schema } from "mongoose"
import { UserRole } from "./users"

export interface AnnouncementType {
	created_by: mongoose.Schema.Types.ObjectId // Referencia a User
	created_at: Date
	updated_at?: Date
	updated_by?: mongoose.Schema.Types.ObjectId
	deleted_at?: Date
	deleted_by?: mongoose.Schema.Types.ObjectId
	title: string
	text: string
	roles: UserRole[]
}

const announcementsSchema = new mongoose.Schema<AnnouncementType>({
	created_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Users",
		required: true,
	},
	created_at: { type: Date, required: true, default: Date.now },
	updated_at: { type: Date },
	updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
	deleted_at: { type: Date },
	deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
	title: { type: String, required: true },
	text: { type: String, required: true },
	roles: {
		type: [String],
		enum: Object.values(UserRole),
		required: true,
		validate: {
			validator: function (value: UserRole[]) {
				return value.length > 0
			},
			message: "At least one role must be provided to view the announcement.",
		},
	},
})

const Announcement = model<AnnouncementType>(
	"Announcement",
	announcementsSchema
)

export default Announcement
