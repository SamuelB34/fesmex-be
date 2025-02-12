import express from "express"
import { authLoggedUser } from "../common/auth/authLoggedUser"
import ProductsController from "../controllers/products.controller"
import ClientsController from "../controllers/clients.controller"

const router = express.Router()

router.get("/", authLoggedUser, ProductsController.addProduct)
router.get("/clients", authLoggedUser, ClientsController.addClients)

export default router
