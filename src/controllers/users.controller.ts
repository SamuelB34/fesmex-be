import { getCurrentWeekRange } from "../common/auth/dateFunctions"
import { NextFunction } from "express"
import { BaseController } from "./base.controller"
const pipedrive = require("pipedrive")

class UsersController extends BaseController {
	public getUsers: any = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const apiClient = new pipedrive.ApiClient()

			// Configure API key authorization: apiToken
			let apiToken = apiClient.authentications.api_key
			apiToken.apiKey = process.env.PIPEDRIVE_API_KEY

			const api = new pipedrive.UsersApi(apiClient)
			const { data } = await api.getUsers()

			const res_value = {
				count: data.length,
				data: data,
			}

			return this.respondSuccess(res, `Success`, res_value)
		} catch (error) {
			next(error)
		}
	}
}

export default new UsersController()
