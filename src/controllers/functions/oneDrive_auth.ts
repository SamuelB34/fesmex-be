import axios from "axios"
import dotenv from "dotenv"
import { Client } from "@microsoft/microsoft-graph-client"
import "isomorphic-fetch"
import fs from "fs"

dotenv.config()

export async function getAccessToken(): Promise<string> {
	const res = await axios.post(
		`https://login.microsoftonline.com/${process.env.ONE_DRIVE_TENANT_ID}/oauth2/v2.0/token`,
		new URLSearchParams({
			grant_type: "client_credentials",
			client_id: process.env.ONE_DRIVE_CLIENT_ID!,
			client_secret: process.env.ONE_DRIVE_CLIENT_SECRET!,
			scope: "https://graph.microsoft.com/.default",
		}),
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		}
	)

	return res.data.access_token
}

export async function uploadFileToOneDrive(
	accessToken: string,
	filePath: string,
	fileName: string
) {
	const client = Client.init({
		authProvider: (done) => done(null, accessToken),
	})

	const fileStream = fs.createReadStream(filePath)

	const response = await client
		.api(`/drive/root:/Documents/${fileName}:/content`)
		.put(fileStream)

	return response
}
