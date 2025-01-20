import express from "express"
import { authLoggedUser } from "../common/auth/authLoggedUser"
import UsersController from "../controllers/users.controller"

const router = express.Router()

router.get("/", authLoggedUser, UsersController.getUsers)

export default router
