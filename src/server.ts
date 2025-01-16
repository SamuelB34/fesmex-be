import { ApolloServer } from "@apollo/server"
import { createServer } from "http"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { WebSocketServer } from "ws"
import { execute, subscribe } from "graphql"
import { useServer } from "graphql-ws/lib/use/ws"
import { app } from "./app"
import { resolvers, typeDefs } from "./schema"
import { makeExecutableSchema } from "@graphql-tools/schema"
import db from "./config/db"

const port = 8000
const cors = require("cors")

// Crear el esquema de GraphQL usando typeDefs y resolvers
const schema = makeExecutableSchema({ typeDefs, resolvers })

const httpServer = createServer(app)

const wsServer = new WebSocketServer({
	server: httpServer,
	path: "/graphql",
})

const wsServerCleanup = useServer(
	{
		schema,
		execute,
		subscribe,
	},
	wsServer
)

const apolloServer = new ApolloServer({
	schema, // Usar el esquema creado
	plugins: [
		ApolloServerPluginDrainHttpServer({ httpServer }),
		{
			async serverWillStart() {
				return {
					async drainServer() {
						await wsServerCleanup.dispose()
					},
				}
			},
		},
	],
})

;(async () => {
	await apolloServer.start()
	app.use(cors({ origin: "*" }))
	app.use("/graphql", expressMiddleware(apolloServer))

	httpServer.listen(port, () => {
		console.log(`🚀 Query endpoint ready at http://localhost:${port}/graphql`)
		console.log(
			`🚀 Subscription endpoint ready at ws://localhost:${port}/graphql`
		)
	})

	db.connect()
})()
