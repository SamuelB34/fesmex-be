import mongoose, { Schema, model } from "mongoose"

export interface PipedriveLeadType {
	psn_code?: string | null
	sn_name?: string | null
	contact_person_name?: string | null
	first_name?: string | null
	last_name?: string | null
	contact_phone?: string | null
	contact_email?: string | null
	city?: string | null
	state?: string | null
	lcsn_code?: string | null
	losn_code?: string | null
}

const pipedriveLeadSchema = new Schema<PipedriveLeadType>({
	psn_code: { type: String, default: null },
	sn_name: { type: String, default: null },
	contact_person_name: { type: String, default: null },
	first_name: { type: String, default: null },
	last_name: { type: String, default: null },
	contact_phone: { type: String, default: null },
	contact_email: { type: String, default: null },
	city: { type: String, default: null },
	state: { type: String, default: null },
	lcsn_code: { type: String, default: null },
	losn_code: { type: String, default: null },
})

const PipedriveLead = model<PipedriveLeadType>(
	"PipedriveLead",
	pipedriveLeadSchema
)

export default PipedriveLead
