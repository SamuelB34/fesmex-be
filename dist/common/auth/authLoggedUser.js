"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLoggedUser = void 0;
const common_1 = require("./common");
const users_1 = __importDefault(require("../../models/users"));
const authLoggedUser = async (req, res, next) => {
    let jwtInfo = (0, common_1.getUserFromJWT)(req);
    if (!jwtInfo || !jwtInfo.user_id || !jwtInfo.user_username)
        return (0, common_1.respondUnauthorized)(res);
    const user = await users_1.default.find({
        _id: jwtInfo.user_id,
        deleted_at: { $exists: false },
    });
    if (!user.length)
        return (0, common_1.respondUnauthorized)(res);
    const user_logged = user[0];
    if (!user_logged.authenticated)
        return (0, common_1.respondUnauthenticated)(res);
    // Load user in the
    // @ts-ignore
    req.user = {
        id: user_logged._id.toString(),
        username: user_logged.middle_name
            ? `${user_logged.first_name} ${user_logged.middle_name} ${user_logged.last_name}`
            : `${user_logged.first_name} ${user_logged.last_name}`,
        role: user_logged.role,
    };
    next();
};
exports.authLoggedUser = authLoggedUser;
//# sourceMappingURL=authLoggedUser.js.map