"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const query_1 = require("./typeDefs/query");
const mutation_1 = require("./typeDefs/mutation");
const subscription_1 = require("./typeDefs/subscription");
const query_2 = require("./resolvers/query");
const mutation_2 = require("./resolvers/mutation");
const subscription_2 = require("./resolvers/subscription");
const users_1 = require("./resolvers/users");
const announcements_1 = require("./resolvers/announcements");
const inventory_1 = require("./resolvers/inventory");
const clients_1 = require("./typeDefs/clients");
const clients_2 = require("./resolvers/clients");
const users_2 = require("./typeDefs/users");
const quotes_1 = require("./typeDefs/quotes");
const quotes_2 = require("./resolvers/quotes");
exports.typeDefs = [
    query_1.queryTypeDefs,
    clients_1.clientTypeDefs,
    users_2.usersTypeDefs,
    mutation_1.mutationTypeDefs,
    subscription_1.subscriptionTypeDefs,
    quotes_1.quotesTypeDefs,
];
exports.resolvers = [
    query_2.queryResolvers,
    mutation_2.mutationResolvers,
    users_1.usersResolvers,
    announcements_1.announcementsResolvers,
    subscription_2.subscriptionResolvers,
    inventory_1.inventoryResolvers,
    clients_2.clientResolvers,
    quotes_2.quotesResolvers,
];
//# sourceMappingURL=index.js.map