import express from "express"
import DealsRoutes from "./deals.routes"
import UsersRoutes from "./users.routes"

const router = express.Router()

router.use("/deals", DealsRoutes)
router.use("/users", UsersRoutes)

export default router
