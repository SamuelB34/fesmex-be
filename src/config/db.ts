import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()
const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/fesmex"

const connect = (): void => {
	console.log(DB_URI)
	mongoose
		.connect(DB_URI)
		.then(() => {
			console.log("Connected to the database! ✅✅✅")
		})
		.catch((err) => {
			console.error("Connection error 💥💥💥", err)
		})
}

export default { connect }
