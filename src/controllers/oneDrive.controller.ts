import fs from "fs"
import { getAccessToken, uploadFileToOneDrive } from "./functions/oneDrive_auth"
import { BaseController } from "./base.controller"
import Quotes, { CreatedMethod } from "../models/quotes"
import { z } from "zod"
import csvParser from "csv-parser"
import { Request, Response, NextFunction } from "express"
import { enrichQuoteWithPipedrive } from "./functions/pipedrive"

const articleExtraInputSchema = z.object({
	multiplier: z.string().optional().transform(Number),
	usa_freight: z.string().optional().transform(Number),
	usa_expenses: z.string().optional().transform(Number),
	duty: z.string().optional().transform(Number),
	mex_freight: z.string().optional().transform(Number),
})

const articleInputSchema = z.object({
	article_number: z.string(),
	delivery: z.string(),
	description: z.string(),
	quantity: z.string().transform(Number),
	price: z.string().transform(Number),
	original_price: z.string().transform(Number),
	total: z.string().transform(Number),
	utility: z.string().transform(Number),
	type: z.string().optional(),
	status: z.string().optional(),
	extra: articleExtraInputSchema,
})

class QuotesController extends BaseController {
	public uploadPdfFile: any = async (
		req: Request,
		res: any,
		next: NextFunction
	) => {
		const file = (req as any).file
		const quoteId = (req as any).body.quoteId

		if (!file) {
			return res.status(400).json({ error: "No file uploaded." })
		}

		if (!quoteId) {
			return res.status(400).json({ error: "quoteId is required." })
		}

		try {
			const accessToken = await getAccessToken()
			const result = await uploadFileToOneDrive(
				accessToken,
				file.path,
				file.originalname
			)

			fs.unlinkSync(file.path)

			const downloadUrl = result["@microsoft.graph.downloadUrl"]

			const new_quote = await Quotes.findByIdAndUpdate(quoteId, {
				pdf_download_link: downloadUrl,
			})
			res.json({
				success: true,
				message: "PDF uploaded and quote updated.",
				quote: new_quote,
				downloadUrl,
			})
		} catch (error: any) {
			console.error("Error uploading to OneDrive:", error)
			res.status(500).json({ error: "Upload failed", details: error.message })
		}
	}

	public uploadQuoteWithCSV = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const file = (req as any).file
		const rawQuote = (req as any).body.quote
		const avoidPipedrive = (req as any).body.avoidPipedrive === "true"

		if (!file || !rawQuote) {
			return res.status(400).json({ error: "Missing CSV file or quote JSON" })
		}

		let parsedQuote: any
		try {
			parsedQuote = JSON.parse(rawQuote)
		} catch (err) {
			return res.status(400).json({ error: "Invalid JSON in quote field" })
		}

		const results: any[] = []

		fs.createReadStream(file.path)
			.pipe(csvParser())
			.on("data", (row) => {
				const isEmptyRow = Object.values(row).every(
					(value) =>
						value === undefined || value === null || String(value).trim() === ""
				)

				if (!isEmptyRow) {
					results.push(row)
				}
			})
			.on("end", async () => {
				try {
					const validatedArticles = results.map((row) =>
						articleInputSchema.parse({
							...row,
							extra: {
								multiplier: row.multiplier,
								usa_freight: row.usa_freight,
								usa_expenses: row.usa_expenses,
								duty: row.duty,
								mex_freight: row.mex_freight,
							},
						})
					)

					const enrichedQuote = await enrichQuoteWithPipedrive(
						{ ...parsedQuote, article: validatedArticles },
						avoidPipedrive
					)

					const newQuote = await Quotes.create({
						...enrichedQuote,
						total: validatedArticles.reduce((acc, curr) => acc + curr.total, 0),
						created_at: new Date(),
						created_method: CreatedMethod.CSV,
					})

					res.json({
						success: true,
						message: "Quote created with CSV",
						quote: newQuote,
					})
				} catch (err: any) {
					console.error("Error uploading quote with CSV:", err)
					res.status(500).json({ error: "Upload failed", details: err.message })
				} finally {
					fs.unlinkSync(file.path)
				}
			})
	}
}

export default new QuotesController()
