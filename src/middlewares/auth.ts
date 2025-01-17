import { getUserFromJWT } from "./common"
import users from "../models/users"

export const authLoggedUser = async (req: any) => {
	let jwtInfo = getUserFromJWT(req)

	if (!jwtInfo || !jwtInfo.user_id || !jwtInfo.user_username) {
		throw new Error("Invalid token")
	}

	const user = await users.find({
		_id: jwtInfo.user_id,
		deleted_at: { $exists: false },
	})

	if (!user.length) {
		throw new Error("User not found")
	}

	const user_logged = user[0]

	if (!user_logged.authenticated) {
		throw new Error("User not authenticated")
	}

	// Devuelve la información del usuario
	return {
		id: user_logged._id.toString(),
		username: user_logged.middle_name
			? `${user_logged.first_name} ${user_logged.middle_name} ${user_logged.last_name}`
			: `${user_logged.first_name} ${user_logged.last_name}`,
		role: user_logged.role,
	}
}
