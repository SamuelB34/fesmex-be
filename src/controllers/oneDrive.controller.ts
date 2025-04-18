import { NextFunction } from "express"
import fs from "fs"
import { getAccessToken, uploadFileToOneDrive } from "./functions/oneDrive_auth"
import { BaseController } from "./base.controller"
import Quotes from "../models/quotes"

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
}

export default new QuotesController()
