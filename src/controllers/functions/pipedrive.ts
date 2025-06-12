import axios from "axios"
import {
	createOrganization,
	createPersonOrganization,
} from "../../middlewares/pipedrive"
import { pipedriveDirectory } from "../../common/directory/pipedriveDirectory"
import { convertToTijuanaTime } from "../../common/auth/dateFunctions"

export const enrichQuoteWithPipedrive = async (
	input: any,
	avoidPipedrive: boolean
): Promise<any> => {
	const total = input.article.reduce((acc, curr) => acc + curr.total, 0)

	const pipedrive_body: any = {
		title: input.project_name,
		value: total,
		currency: "USD",
		status: input.status,
		stage_id: pipedriveDirectory[input.quote_status],
		add_time: convertToTijuanaTime(input.date),
		owner_id: +input.created_by.pipedrive_id,
	}

	if (input.company_pipedrive_id && input.company_pipedrive_id !== "NaN") {
		pipedrive_body.org_id = +input.company_pipedrive_id
	} else if (!avoidPipedrive) {
		const createdOrg = await createOrganization({
			name: input.company,
			owner_id: +input.created_by.pipedrive_id,
		})
		pipedrive_body.org_id = createdOrg.data.data.id
	}

	if (
		input.company_contact.pipedrive_id &&
		input.company_contact.pipedrive_id !== "NaN"
	) {
		pipedrive_body.person_id = +input.company_contact.pipedrive_id
	} else if (!avoidPipedrive) {
		const createdContact = await createPersonOrganization({
			name: input.company_contact.name,
			owner_id: +input.created_by.pipedrive_id,
			org_id: pipedrive_body.org_id,
			email: input.company_contact.email,
			phone_number: input.company_contact.mobile,
		})
		pipedrive_body.person_id = createdContact.data.data.id
	}

	let pipedriveResponse = null
	if (!avoidPipedrive) {
		pipedriveResponse = await axios.post(
			"https://api.pipedrive.com/api/v2/deals",
			pipedrive_body,
			{
				params: { api_token: process.env.PIPEDRIVE_API_KEY },
			}
		)
	}

	return {
		...input,
		company_contact: {
			...input.company_contact,
			pipedrive_id:
				input.company_contact.pipedrive_id ?? `${pipedrive_body.person_id}`,
		},
		company_pipedrive_id:
			input.company_pipedrive_id ?? `${pipedrive_body.org_id}`,
		pipedrive_id: pipedriveResponse?.data?.data?.id ?? null,
		created_by: input.created_by.id,
	}
}
