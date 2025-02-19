import { queryTypeDefs } from "./typeDefs/query"
import { mutationTypeDefs } from "./typeDefs/mutation"
import { subscriptionTypeDefs } from "./typeDefs/subscription"
import { queryResolvers } from "./resolvers/query"
import { mutationResolvers } from "./resolvers/mutation"
import { subscriptionResolvers } from "./resolvers/subscription"
import { usersResolvers } from "./resolvers/users"
import { announcementsResolvers } from "./resolvers/announcements"
import { inventoryResolvers } from "./resolvers/inventory"
import { clientTypeDefs } from "./typeDefs/clients"
import { clientResolvers } from "./resolvers/clients"
import { usersTypeDefs } from "./typeDefs/users"
import { quotesTypeDefs } from "./typeDefs/quotes"
import { quotesResolvers } from "./resolvers/quotes"

export const typeDefs = [
	queryTypeDefs,
	clientTypeDefs,
	usersTypeDefs,
	mutationTypeDefs,
	subscriptionTypeDefs,
	quotesTypeDefs,
]

export const resolvers = [
	queryResolvers,
	mutationResolvers,
	usersResolvers,
	announcementsResolvers,
	subscriptionResolvers,
	inventoryResolvers,
	clientResolvers,
	quotesResolvers,
]
