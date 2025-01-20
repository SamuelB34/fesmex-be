import express from "express"
import { authLoggedUser } from "../common/auth/authLoggedUser"
import DealsController from "../controllers/deals.controller"

const router = express.Router()

router.get("/", authLoggedUser, DealsController.getDeals)

export default router
