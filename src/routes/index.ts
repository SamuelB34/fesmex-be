import express from "express"
import DealsRoutes from "./deals.routes"
import UsersRoutes from "./users.routes"
import ProductsRoutes from "./products.routes"
import QuotesRoutes from "./quotes.routes"

const router = express.Router()

router.use("/deals", DealsRoutes)
router.use("/users", UsersRoutes)
router.use("/products", ProductsRoutes)
router.use("/products", ProductsRoutes)
router.use("/quotes", QuotesRoutes)

export default router
