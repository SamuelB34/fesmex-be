import { pubSub } from "../pubsub"

export const subscriptionResolvers = {
	Subscription: {
		operationFinished: {
			subscribe: () => pubSub.asyncIterator(["OPERATION_FINISHED"]),
		},
	},
}
