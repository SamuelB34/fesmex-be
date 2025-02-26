import { NextFunction } from "express"
import { BaseController } from "./base.controller"
import { clientsLists, leadsList } from "./addOrganizations"
import Clients from "../models/clients"
import PipedriveLead from "../models/pipedriveLead"

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

	public addLeads: any = async (req: Request, res: any, next: NextFunction) => {
		try {
			const clients_list = leadsList()

			const leads = await PipedriveLead.insertMany(clients_list)

			return this.respondSuccess(res, `Records inserted successfully!`, leads)
		} catch (error) {
			console.error(error)
			next(error)
		}
	}
}

export default new ClientsController()
