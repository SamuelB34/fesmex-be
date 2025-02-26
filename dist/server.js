"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const http_1 = require("http");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const ws_1 = require("ws");
const graphql_1 = require("graphql");
const ws_2 = require("graphql-ws/lib/use/ws");
const app_1 = require("./app");
const schema_1 = require("./schema");
const schema_2 = require("@graphql-tools/schema");
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./middlewares/auth");
const port = 8000;
// Crear el esquema de GraphQL usando typeDefs y resolvers
const schema = (0, schema_2.makeExecutableSchema)({ typeDefs: schema_1.typeDefs, resolvers: schema_1.resolvers });
const httpServer = (0, http_1.createServer)(app_1.app);
const wsServer = new ws_1.WebSocketServer({
    server: httpServer,
    path: "/graphql",
});
const wsServerCleanup = (0, ws_2.useServer)({
    schema,
    execute: graphql_1.execute,
    subscribe: graphql_1.subscribe,
    context: async (ctx, msg, args) => {
        // Si quieres proteger también las suscripciones, puedes realizar validaciones aquí
        return {};
    },
}, wsServer);
const apolloServer = new server_1.ApolloServer({
    schema, // Usar el esquema creado
    plugins: [
        (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await wsServerCleanup.dispose();
                    },
                };
            },
        },
    ],
});
(async () => {
    await apolloServer.start();
    app_1.app.use((0, cors_1.default)({ origin: "*" }));
    app_1.app.use("/graphql", (0, express4_1.expressMiddleware)(apolloServer, {
        context: async ({ req }) => {
            var _a, _b;
            const isLoginQuery = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.query) === null || _b === void 0 ? void 0 : _b.includes("login");
            if (isLoginQuery)
                return { user: null };
            try {
                const user = await (0, auth_1.authLoggedUser)(req);
                return { user };
            }
            catch (error) {
                throw new Error(error.message);
            }
        },
    }));
    httpServer.listen(port, () => {
        console.log(`🚀 Query endpoint ready at http://localhost:${port}/graphql`);
        console.log(`🚀 Subscription endpoint ready at ws://localhost:${port}/graphql`);
    });
    db_1.default.connect();
})();
//# sourceMappingURL=server.js.map