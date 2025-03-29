import { convertToTijuanaTime } from "../common/auth/dateFunctions"
import axios from "axios"
import { QuoteStatus, Status } from "../models/quotes"
import { pipedriveDirectory } from "../common/directory/pipedriveDirectory"

interface CreateOrganization {
	name: string
	owner_id: number
}

interface CreatePersonOrganization {
	name: string
	owner_id: number
	org_id: number
	email: string
	phone_number: string
}

interface UpdateQuote {
	title: string
	value: number
	currency: "USD"
	status: string
	stage_id: string
	owner_id: number
}

export const createOrganization = async (data: CreateOrganization) => {
	const date = new Date(Date.now())
	const body = {
		name: data.name,
		owner_id: data.owner_id,
		add_time: convertToTijuanaTime(date),
		visible_to: 3,
	}
	return await axios.post(
		"https://api.pipedrive.com/api/v2/organizations",
		body,
		{
			params: {
				api_token: process.env.PIPEDRIVE_API_KEY,
			},
		}
	)
}

export const createPersonOrganization = async (
	data: CreatePersonOrganization
) => {
	const date = new Date(Date.now())
	const body = {
		name: data.name,
		owner_id: data.owner_id,
		org_id: data.org_id,
		add_time: convertToTijuanaTime(date),
		emails: [
			{
				value: data.email,
				primary: true,
				label: "work",
			},
		],
		phones: [
			{
				value: data.phone_number,
				primary: true,
				label: "work",
			},
		],
		visible_to: 3,
	}
	return await axios.post("https://api.pipedrive.com/api/v2/persons", body, {
		params: {
			api_token: process.env.PIPEDRIVE_API_KEY,
		},
	})
}

export const updateQuote = async (id: string, body: UpdateQuote) => {
	return await axios.patch(
		`https://api.pipedrive.com/api/v2/deals/${id}`,
		body,
		{
			params: {
				api_token: process.env.PIPEDRIVE_API_KEY,
			},
		}
	)
}

export const updateQuoteStatus = async (id: string, status: string) => {
	return await axios.patch(
		`https://api.pipedrive.com/api/v2/deals/${id}`,
		{ status },
		{
			params: {
				api_token: process.env.PIPEDRIVE_API_KEY,
			},
		}
	)
}

export const updateQuoteStage = async (id: string, stage_id: number) => {
	return await axios.patch(
		`https://api.pipedrive.com/api/v2/deals/${id}`,
		{ stage_id },
		{
			params: {
				api_token: process.env.PIPEDRIVE_API_KEY,
			},
		}
	)
}
