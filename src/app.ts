import express from "express"
import bodyParser from "body-parser"
import routes from "./routes"
import cors from "cors"

export const app = express()
app.use(cors({ origin: "*" }))
app.use(
	bodyParser.json({
		limit: "20mb",
	})
)
app.use("/graphql", bodyParser.json())
app.use("/", routes)
