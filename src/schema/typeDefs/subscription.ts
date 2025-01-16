export const subscriptionTypeDefs = `
    type Subscription {
        operationFinished: Operation!
    }
    type Operation {
        name: String!
        endDate: String!
        user: Int!
    }
`
