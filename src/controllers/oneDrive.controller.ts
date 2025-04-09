import { NextFunction } from "express"
import fs from "fs"
import { getAccessToken, uploadFileToOneDrive } from "./functions/oneDrive_auth"
import { BaseController } from "./base.controller"

class QuotesController extends BaseController {
	public uploadPdfFile: any = async (
		req: Request,
		res: any,
		next: NextFunction
	) => {
		const file = (req as any).file

		if (!file) {
			return res.status(400).json({ error: "No file uploaded." })
		}
		console.log("HOLA ✅✅✅✅✅✅✅")
		try {
			const accessToken = await getAccessToken()
			console.log("🔑 Token:", accessToken)
			console.log("HOLA 🚨🚨🚨🚨🚨🚨")
			const result = await uploadFileToOneDrive(
				accessToken,
				file.path,
				file.originalname
			)

			fs.unlinkSync(file.path)
			console.log("HOLA ❤️❤️❤️❤️❤️❤️❤️")
			res.json({ success: true, result })
		} catch (error: any) {
			console.error("Error uploading to OneDrive:", error)
			res.status(500).json({ error: "Upload failed", details: error.message })
		}
	}
}

export default new QuotesController()
