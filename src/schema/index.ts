import { queryTypeDefs } from "./typeDefs/query"
import { mutationTypeDefs } from "./typeDefs/mutation"
import { subscriptionTypeDefs } from "./typeDefs/subscription"
import { queryResolvers } from "./resolvers/query"
import { mutationResolvers } from "./resolvers/mutation"
import { subscriptionResolvers } from "./resolvers/subscription"
import { usersResolvers } from "./resolvers/users"

export const typeDefs = [queryTypeDefs, mutationTypeDefs, subscriptionTypeDefs]

export const resolvers = [
	queryResolvers,
	mutationResolvers,
	usersResolvers,
	subscriptionResolvers,
]
