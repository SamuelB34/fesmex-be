import express from "express"
import bodyParser from "body-parser"
import routes from "./routes"

export const app = express()

app.use(
	bodyParser.json({
		limit: "20mb",
	})
)
app.use("/graphql", bodyParser.json())
app.use("/pipedrive", routes)
