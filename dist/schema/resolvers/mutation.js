"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutationResolvers = void 0;
const pubsub_1 = require("../pubsub");
const format_1 = require("../../middlewares/format");
const mockLongLastingOperation = (name, user) => {
    setTimeout(() => {
        pubsub_1.pubSub.publish("OPERATION_FINISHED", {
            operationFinished: {
                name,
                user,
                endDate: (0, format_1.formatDate)(Date.now()),
            },
        });
    }, 1000);
};
exports.mutationResolvers = {
    Mutation: {
        scheduleOperation(_, { name, user }) {
            mockLongLastingOperation(name, user);
            return `Operation: ${name} scheduled!`;
        },
    },
};
//# sourceMappingURL=mutation.js.map