import express from "express"
import DealsRoutes from "./deals.routes"
import UsersRoutes from "./users.routes"
import ProductsRoutes from "./products.routes"

const router = express.Router()

router.use("/deals", DealsRoutes)
router.use("/users", UsersRoutes)
router.use("/products", ProductsRoutes)

export default router
