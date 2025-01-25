import { getCurrentWeekRange } from "../common/auth/dateFunctions"
import { NextFunction } from "express"
import { BaseController } from "./base.controller"
import { orgLists, productsLists } from "./addOrganizations"
import axios from "axios"
import Inventory from "../models/inventory"
const pipedrive = require("pipedrive")

class ProductsController extends BaseController {
	public addProduct: any = async (
		req: Request,
		res: any,
		next: NextFunction
	) => {
		try {
			const products_list = productsLists()

			const inventory = await Inventory.insertMany(products_list)

			return this.respondSuccess(
				res,
				`Records inserted successfully!`,
				inventory
			)
		} catch (error) {
			console.error(error)
			next(error)
		}
	}
}

export default new ProductsController()
