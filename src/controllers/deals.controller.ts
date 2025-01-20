import { getCurrentWeekRange } from "../common/auth/dateFunctions"
import axios from "axios"
import { NextFunction } from "express"
import { BaseController } from "./base.controller"

class DealsController extends BaseController {
	public getDeals: any = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const dates = getCurrentWeekRange()

			const response = await axios.get(
				"https://api.pipedrive.com/api/v2/deals",
				{
					params: {
						api_token: process.env.PIPEDRIVE_API_KEY,
						updated_since: dates.start,
						updated_until: dates.end,
						status: "won",
					},
				}
			)

			const { data } = response

			const res_data = {
				count: data.data.length,
				data: data.data,
			}

			return this.respondSuccess(res, `Success`, res_data)
		} catch (error) {
			next(error)
		}
	}
}

export default new DealsController()
