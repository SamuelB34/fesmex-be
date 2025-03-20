import {
	getCurrentDateTime,
	getCurrentWeekRange,
} from "../common/auth/dateFunctions"
import axios from "axios"
import { NextFunction } from "express"
import { BaseController } from "./base.controller"
import { orgLists } from "./functions/addOrganizations"

class DealsController extends BaseController {
	public getDeals: any = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const dates = getCurrentWeekRange()

			console.log(dates)

			const response = await axios.get(
				"https://api.pipedrive.com/api/v2/deals",
				{
					params: {
						api_token: process.env.PIPEDRIVE_API_KEY,
						updated_since: dates.start,
						updated_until: dates.end,
						status: "open",
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

	public createDeal: any = async (
		req: Request,
		res: any,
		next: NextFunction
	) => {
		try {
			const { title, value, currency, status, add_time, owner_id }: any =
				req.body

			if (!title || !value || !currency) {
				return this.respondInvalid(res)
			}

			const response = await axios.post(
				"https://api.pipedrive.com/api/v2/deals",
				{
					title,
					value,
					currency,
					status,
					owner_id,
					add_time: add_time || getCurrentDateTime(),
				},
				{
					params: {
						api_token: process.env.PIPEDRIVE_API_KEY, // API Key
					},
				}
			)

			const { data } = response

			console.log("HOLAAA")

			return this.respondSuccess(res, `Deal added successfully`, data.data)
		} catch (error) {
			console.error(error)
			next(error)
		}
	}

	public createOrganization: any = async (
		req: Request,
		res: any,
		next: NextFunction
	) => {
		try {
			const x: any = req.body

			if (!x.name) {
				return this.respondInvalid(res)
			}

			const clients_list = orgLists()

			// for (let i = 0; i < 2; i++) {
			// 	const response = await axios.post(
			// 		"https://api.pipedrive.com/v1/organizations",
			// 		{
			// 			name: clients_list[i]["Nombre SN"],
			// 			b60d43f481072d08b68b4494ab7670a785ded1b6:
			// 				clients_list[i]["Teléfono 1"],
			//
			// 		},
			// 		{
			// 			params: {
			// 				api_token: process.env.PIPEDRIVE_API_KEY, // API Key
			// 			},
			// 		}
			// 	)
			//
			// 	const { data } = response
			// 	console.log("Record ", i, " insertado")
			// }
			return this.respondSuccess(res, `Deal added successfully`, {
				clients_list,
			})
		} catch (error) {
			console.error(error)
			next(error)
		}
	}
}

export default new DealsController()
