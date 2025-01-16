const jwt = require("jsonwebtoken")

export interface LoginJwt {
	user_id: string
	user_username: string
	user_role: string
}

export const getUserFromJWT = (req: Request) => {
	let bearerHeader =
		req.headers["Authorization"] || req.headers["authorization"]

	if (!bearerHeader || Array.isArray(bearerHeader)) return false

	let token = bearerHeader.split(" ")[1]

	try {
		// Validate token
		let decoded: any = jwt.verify(token, process.env.JWT_SECRET ?? "")

		if (!decoded.user_id || !decoded.user_username) return false

		// Token is valid, return id and username
		return <LoginJwt>{
			user_id: decoded.user_id,
			user_username: decoded.user_username,
		}
	} catch (e) {
		return false
	}
}
