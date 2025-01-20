import express from "express"
import bodyParser from "body-parser"
import routes from "./routes"

export const app = express()

app.use("/graphql", bodyParser.json())
app.use("/pipedrive", routes)
