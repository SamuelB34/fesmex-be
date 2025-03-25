import mongoose, { Schema, model } from "mongoose"

export interface ContactType {
	contact_person_name?: string | null
	first_name?: string | null
	last_name?: string | null
	contact_phone?: string | null
	contact_email?: string | null
	pipedrive_id?: string | null
}

export interface ClientType {
	sn_code?: string | null
	sn_name?: string | null
	tax_id?: string | null
	currency?: string | null
	phone_1?: string | null
	email?: string | null
	sales_department_employee_code?: string | null
	sales_department_employee_name?: string | null
	payment_terms_code?: string | null
	payment_terms_name?: string | null
	price_list_number?: string | null
	price_list_name?: string | null
	address_name?: string | null
	street?: string | null
	neighborhood?: string | null
	postal_code?: string | null
	city?: string | null
	state?: string | null
	country_region?: string | null
	payment_method_code?: string | null
	payment_method_description?: string | null
	comments?: string | null
	contacts?: ContactType[]
	pipedrive_id?: string | null
}

const contactSchema = new Schema<ContactType>({
	contact_person_name: { type: String, default: null },
	first_name: { type: String, default: null },
	last_name: { type: String, default: null },
	contact_phone: { type: String, default: null },
	contact_email: { type: String, default: null },
	pipedrive_id: { type: String, default: null },
})

const clientSchema = new Schema<ClientType>({
	sn_code: { type: String, default: null },
	sn_name: { type: String, default: null },
	tax_id: { type: String, default: null },
	currency: { type: String, default: null },
	phone_1: { type: String, default: null },
	email: { type: String, default: null },
	sales_department_employee_code: { type: String, default: null },
	sales_department_employee_name: { type: String, default: null },
	payment_terms_code: { type: String, default: null },
	payment_terms_name: { type: String, default: null },
	price_list_number: { type: String, default: null },
	price_list_name: { type: String, default: null },
	address_name: { type: String, default: null },
	street: { type: String, default: null },
	neighborhood: { type: String, default: null },
	postal_code: { type: String, default: null },
	city: { type: String, default: null },
	state: { type: String, default: null },
	country_region: { type: String, default: null },
	payment_method_code: { type: String, default: null },
	payment_method_description: { type: String, default: null },
	comments: { type: String, default: null },
	pipedrive_id: { type: String, default: null },
	contacts: { type: [contactSchema], default: [] },
})

const Client = model<ClientType>("Client", clientSchema)

export default Client
