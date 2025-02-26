"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionTypeDefs = void 0;
exports.subscriptionTypeDefs = `
    type Subscription {
        operationFinished: Operation!
    }
    type Operation {
        name: String!
        endDate: String!
        user: Int!
    }
`;
//# sourceMappingURL=subscription.js.map