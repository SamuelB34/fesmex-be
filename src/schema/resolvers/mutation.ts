import { pubSub } from "../pubsub"
import { formatDate } from "../../middlewares/format"

const mockLongLastingOperation = (name: string, user: number) => {
	setTimeout(() => {
		pubSub.publish("OPERATION_FINISHED", {
			operationFinished: {
				name,
				user,
				endDate: formatDate(Date.now()),
			},
		})
	}, 1000)
}

export const mutationResolvers = {
	Mutation: {
		scheduleOperation(_, { name, user }: { name: string; user: number }) {
			mockLongLastingOperation(name, user)
			return `Operation: ${name} scheduled!`
		},
	},
}
