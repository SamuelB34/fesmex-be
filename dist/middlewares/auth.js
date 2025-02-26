"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLoggedUser = void 0;
const common_1 = require("./common");
const users_1 = __importDefault(require("../models/users"));
const authLoggedUser = async (req) => {
    let jwtInfo = (0, common_1.getUserFromJWT)(req);
    if (!jwtInfo || !jwtInfo.user_id || !jwtInfo.user_username) {
        throw new Error("Invalid token");
    }
    const user = await users_1.default.find({
        _id: jwtInfo.user_id,
        deleted_at: { $exists: false },
    });
    if (!user.length) {
        throw new Error("User not found");
    }
    const user_logged = user[0];
    if (!user_logged.authenticated) {
        throw new Error("User not authenticated");
    }
    // Devuelve la información del usuario
    return {
        id: user_logged._id.toString(),
        username: user_logged.middle_name
            ? `${user_logged.first_name} ${user_logged.middle_name} ${user_logged.last_name}`
            : `${user_logged.first_name} ${user_logged.last_name}`,
        role: user_logged.role,
    };
};
exports.authLoggedUser = authLoggedUser;
//# sourceMappingURL=auth.js.map