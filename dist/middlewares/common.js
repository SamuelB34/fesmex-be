"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromJWT = void 0;
const jwt = require("jsonwebtoken");
const getUserFromJWT = (req) => {
    var _a;
    let bearerHeader = req.headers["Authorization"] || req.headers["authorization"];
    if (!bearerHeader || Array.isArray(bearerHeader))
        return false;
    let token = bearerHeader.split(" ")[1];
    try {
        // Validate token
        let decoded = jwt.verify(token, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "");
        if (!decoded.user_id || !decoded.user_username)
            return false;
        // Token is valid, return id and username
        return {
            user_id: decoded.user_id,
            user_username: decoded.user_username,
        };
    }
    catch (e) {
        return false;
    }
};
exports.getUserFromJWT = getUserFromJWT;
//# sourceMappingURL=common.js.map