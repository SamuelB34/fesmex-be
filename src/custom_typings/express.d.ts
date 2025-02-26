/**
 * This file will be used for internal type definitions
 */
export {}

declare global {
	namespace Express {
		export interface SignedInUser {
			id: string
			username: string
			role: "admin" | "sales" | "technician" | "warehouseman"
		}

		export interface Request {
			user?: SignedInUser
		}
	}
}
