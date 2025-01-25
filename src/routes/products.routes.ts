import express from "express"
import { authLoggedUser } from "../common/auth/authLoggedUser"
import ProductsController from "../controllers/products.controller"

const router = express.Router()

router.get("/", authLoggedUser, ProductsController.addProduct)

export default router
