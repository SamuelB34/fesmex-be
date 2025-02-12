import { NextFunction } from "express"
import { BaseController } from "./base.controller"
import { clientsLists } from "./addOrganizations"
import Clients from "../models/clients"

class ClientsController extends BaseController {
	public addClients: any = async (
		req: Request,
		res: any,
		next: NextFunction
	) => {
		try {
			const clients_list = clientsLists()

			const clients = await Clients.insertMany(clients_list)

			return this.respondSuccess(res, `Records inserted successfully!`, clients)
		} catch (error) {
			console.error(error)
			next(error)
		}
	}
}

export default new ClientsController()
