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
import cors from "cors"
import { authLoggedUser } from "./middlewares/auth"
import routes from "./routes"

const port = 8000

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
		context: async (ctx, msg, args) => {
			// Si quieres proteger también las suscripciones, puedes realizar validaciones aquí
			return {}
		},
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
	app.use(
		"/graphql",
		expressMiddleware(apolloServer, {
			context: async ({ req }) => {
				const isLoginQuery = req.body?.query?.includes("login")
				if (isLoginQuery) return { user: null }

				try {
					const user = await authLoggedUser(req)
					return { user }
				} catch (error) {
					throw new Error(error.message)
				}
			},
		})
	)

	httpServer.listen(port, () => {
		console.log(`🚀 Query endpoint ready at http://localhost:${port}/graphql`)
		console.log(
			`🚀 Subscription endpoint ready at ws://localhost:${port}/graphql`
		)
	})

	db.connect()
})()
