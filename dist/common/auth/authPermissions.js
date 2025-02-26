"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authPermissions = void 0;
const common_1 = require("./common");
const users_1 = __importDefault(require("../../models/users"));
const authPermissions = (min_role) => {
    return async (req, res) => {
        let jwtInfo = (0, common_1.getUserFromJWT)(req);
        if (!jwtInfo || !jwtInfo.user_id || !jwtInfo.user_username)
            return (0, common_1.respondUnauthorized)(res);
        // Get user's information
        const user = await users_1.default.find({
            _id: jwtInfo.user_id,
            deleted_at: { $exists: false },
        });
        // No user? Finish
        if (!user.length)
            return (0, common_1.respondUnauthorized)(res);
        // No authenticated? finish
        if (!user[0].authenticated)
            return (0, common_1.respondUnauthorized)(res);
    };
};
exports.authPermissions = authPermissions;
//# sourceMappingURL=authPermissions.js.map