import mongoose, { Schema, model } from "mongoose"
import { Currency } from "./inventory"

export enum Status {
	OPEN = "open",
	WIN = "win",
	LOST = "lost",
	DELETE = "delete",
}

export enum QuoteStatus {
	OPPORTUNITY = "opportunity",
	QUOTE = "quote",
	FOLLOWING = "following",
	NEGOTIATION = "negotiation",
}

interface CompanyContact {
	name: string
	email: string
	mobile: string
	pipedrive_id: string
}

interface ArticleExtra {
	multiplier?: number
	usa_freight?: number
	usa_expenses?: number
	duty?: number
	mex_freight?: number
}

interface Article {
	article_number: string
	delivery: string
	description: string
	quantity: number
	price: number
	original_price: number
	total: number
	utility: number
	extra: ArticleExtra
	type?: string
}

export interface QuotesType {
	date: Date
	quote_number: number
	quote_revision: number
	quote_ref: string
	company: string
	company_pipedrive_id: string
	company_contact: CompanyContact
	project_name: string
	project_lab: string
	payment_condition: string
	payment_exp: string
	article: Article[]
	created_by: string
	created_at: Date
	deleted_at: Date
	deleted_by: string
	terms?: string[]
	iva?: string
	currency?: string
	sap_id?: string
	pipedrive_id?: string
	pdf_download_link?: string
	status?: Status
	quote_status?: QuoteStatus
	notes?: string
}

const companyContactSchema = new Schema<CompanyContact>({
	name: { type: String, required: true },
	email: { type: String, required: true },
	mobile: { type: String, required: true },
	pipedrive_id: { type: String },
})

const articleExtraSchema = new Schema<ArticleExtra>({
	multiplier: { type: Number, required: false },
	usa_freight: { type: Number, required: false },
	usa_expenses: { type: Number, required: false },
	duty: { type: Number, required: false },
	mex_freight: { type: Number, required: false },
})

const articleSchema = new Schema<Article>({
	article_number: { type: String, required: true },
	delivery: { type: String, required: true },
	description: { type: String, required: true },
	quantity: { type: Number, required: true },
	price: { type: Number, required: true },
	original_price: { type: Number, required: true },
	total: { type: Number, required: true },
	utility: { type: Number, required: true },
	extra: { type: articleExtraSchema, required: false },
	type: { type: String, required: false },
})

const quotesSchema = new Schema<QuotesType>({
	date: { type: Date, required: true },
	quote_number: { type: Number, required: true },
	quote_revision: { type: Number, required: true },
	quote_ref: { type: String, required: true },
	company: { type: String, required: true },
	company_pipedrive_id: { type: String, isNullable: true },
	company_contact: { type: companyContactSchema, required: true },
	project_name: { type: String, required: true },
	project_lab: { type: String, required: true },
	payment_condition: { type: String, required: true },
	payment_exp: { type: String, required: true },
	article: { type: [articleSchema], required: true },
	created_by: { type: String, required: true, ref: "Users" },
	terms: { type: [String], required: false },
	iva: { type: String, required: false },
	currency: { type: String, required: false },
	sap_id: { type: String, required: false },
	pipedrive_id: { type: String, required: false },
	pdf_download_link: { type: String, required: false },
	status: {
		type: String,
		enum: Object.values(Status),
		required: false,
		default: Status.OPEN,
	},
	quote_status: {
		type: String,
		enum: Object.values(QuoteStatus),
		required: false,
		default: QuoteStatus.OPPORTUNITY,
	},
	notes: { type: String, required: false },
	created_at: { type: Date, required: false },
	deleted_at: { type: Date, required: false },
	deleted_by: { type: String, required: false },
})

const QuotesModel = model<QuotesType>("Quotes", quotesSchema)
export default QuotesModel
