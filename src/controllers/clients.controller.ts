import { NextFunction } from "express"
import { BaseController } from "./base.controller"
import Clients from "../models/clients"
import PipedriveLead from "../models/pipedriveLead"
import { clientsLists, leadsList } from "./functions/addOrganizations"

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

	public addPipedriveIdToClients: any = async (
		req: Request,
		res: any,
		next: NextFunction
	) => {
		try {
			const clients = await Clients.find({}, { sn_code: 1 })
			const leads = await PipedriveLead.find({}, { psn_code: 1, losn_code: 1 })

			const leadsMap = new Map()
			leads.forEach((lead) => {
				if (lead.psn_code && lead.losn_code) {
					leadsMap.set(lead.psn_code, lead.losn_code)
				}
			})

			// Crear operaciones de actualización
			const operations = clients
				.map((client) => {
					const pipedriveId = leadsMap.get(client.sn_code)
					if (pipedriveId) {
						return {
							updateOne: {
								filter: { _id: client._id },
								update: { $set: { pipedrive_id: pipedriveId } },
							},
						}
					}
					return null
				})
				.filter(Boolean)

			// Ejecutar si hay operaciones
			if (operations.length > 0) {
				const result = await Clients.bulkWrite(operations)
				return this.respondSuccess(
					res,
					`${result.modifiedCount} clients updated with pipedrive_id.`,
					result
				)
			} else {
				return this.respondSuccess(res, `No matches found. No updates made.`)
			}
		} catch (error) {
			console.error(error)
			next(error)
		}
	}

	public addPipedriveIdToContacts: any = async (
		req: Request,
		res: any,
		next: NextFunction
	) => {
		try {
			const clients = await Clients.find({}, { sn_code: 1, contacts: 1 })
			const leads = await PipedriveLead.find(
				{
					contact_email: { $ne: null },
					lcsn_code: { $nin: [null, "NaN"] },
				},
				{ contact_email: 1, lcsn_code: 1 }
			)

			// Normalizar y mapear leads por email
			const leadsMap = new Map()
			leads.forEach((lead) => {
				const email = lead.contact_email?.trim().toLowerCase()
				if (email) leadsMap.set(email, lead.lcsn_code)
			})

			const updatedClientsInfo: {
				_id: string
				sn_code?: string
				contact_email: string
				pipedrive_id: string
			}[] = []

			for (const client of clients) {
				for (let i = 0; i < client.contacts.length; i++) {
					const contact = client.contacts[i]
					const normalizedEmail = contact.contact_email?.trim().toLowerCase()
					const pipedriveId = leadsMap.get(normalizedEmail)

					if (pipedriveId) {
						await Clients.updateOne(
							{
								_id: client._id,
								[`contacts.${i}.contact_email`]: contact.contact_email,
							},
							{
								$set: {
									[`contacts.${i}.pipedrive_id`]: pipedriveId,
								},
							}
						)

						updatedClientsInfo.push({
							_id: client._id.toString(),
							sn_code: client.sn_code,
							contact_email: contact.contact_email ?? "",
							pipedrive_id: pipedriveId,
						})
					}
				}
			}

			if (updatedClientsInfo.length > 0) {
				return this.respondSuccess(
					res,
					`${updatedClientsInfo.length} contacts updated with pipedrive_id.`,
					updatedClientsInfo
				)
			} else {
				return this.respondSuccess(res, `No contacts matched. No updates made.`)
			}
		} catch (error) {
			console.error(error)
			next(error)
		}
	}
}

export default new ClientsController()
