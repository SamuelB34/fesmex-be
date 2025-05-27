import express from "express"
import { authLoggedUser } from "../common/auth/authLoggedUser"
import QuotesController from "../controllers/oneDrive.controller"
import multer from "multer"

const router = express.Router()

const upload = multer({ dest: "uploads/" })

router.post(
	"/pdf",
	upload.single("file"),
	authLoggedUser,
	QuotesController.uploadPdfFile
)

router.post(
	"/upload",
	upload.single("file"),
	authLoggedUser,
	QuotesController.uploadQuoteWithCSV
)

export default router
