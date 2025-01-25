import mongoose, { Schema, model } from "mongoose"

export enum Currency {
	USD = "USD",
	MXP = "MXP",
	EUR = "EUR",
	EMPTY = "",
}

export enum Class {
	ARTICULO = "articulo",
	VIAJES = "viajes",
	TRABAJO = "trabajo",
}

export enum Group {
	ACCS_BOMBEO = "ACCS BOMBEO",
	ACCS_HIDRONICOS = "ACCS HIDRONICOS",
	ARTICULOS = "Artículos",
	BOMBAS = "BOMBAS",
	CONTROL_Y_AUT = "CONTROL Y AUT.",
	DISTRIB_AIRE = "DISTRIB. AIRE",
	INGENIERIA = "INGENIERIA",
	MOTORES = "MOTORES",
	PAQUETE_DE_BOMBEO = "PAQUETE DE BOMBEO",
	PUMP_KITS = "PUMP KITS",
	REFACCIONES = "REFACCIONES",
	VENTILACION = "VENTILACION",
	VENTILADORES_HVLS = "VENTILADORES HVLS",
}

export interface ArticleType {
	article_number: string
	description: string
	count: number
	sat_code?: string | null
	unit: string
	brand: string
	group: Group
	SubClase?: string | null
	model?: string | null
	price: number
	currency?: Currency
}

const inventorySchema = new Schema<ArticleType>({
	article_number: { type: String, required: true },
	description: { type: String },
	count: { type: Number, required: true },
	sat_code: { type: String, required: false, default: null },
	unit: { type: String },
	brand: { type: String },
	group: {
		type: String,
		enum: Object.values(Group),
		required: true,
	},
	SubClase: { type: String, required: false, default: null },
	model: { type: String, required: false, default: null },
	price: { type: Number, required: false, default: 0 },
	currency: {
		type: String,
		enum: Object.values(Currency),
		required: false,
		default: Currency.EMPTY,
	},
})

const Inventory = model<ArticleType>("Inventory", inventorySchema)

export default Inventory
