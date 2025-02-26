"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionResolvers = void 0;
const pubsub_1 = require("../pubsub");
exports.subscriptionResolvers = {
    Subscription: {
        operationFinished: {
            subscribe: () => pubsub_1.pubSub.asyncIterator(["OPERATION_FINISHED"]),
        },
    },
};
//# sourceMappingURL=subscription.js.map