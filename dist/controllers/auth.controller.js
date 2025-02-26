"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("./base.controller");
const users_1 = __importDefault(require("../models/users"));
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class AuthController extends base_controller_1.BaseController {
    constructor() {
        super(...arguments);
        this.login = async (req, res, next) => {
            try {
                const body = req.body;
                const password = body.password;
                const user = await users_1.default.find({
                    username: body.username,
                    deleted_at: { $exists: false },
                });
                if (!user.length)
                    return this.respondInvalid(res, `Invalid username or password`);
                const user_password = user[0].password;
                const check_user_password = await bcrypt.compare(password, user_password);
                if (!check_user_password)
                    return this.respondInvalid(res, `Invalid username or password`);
                const payload = {
                    user_id: user[0]._id.toString(),
                    user_username: user[0].username,
                    user_role: user[0].role,
                };
                const token = {
                    id: user[0]._id,
                    jwt: jwt.sign(payload, process.env.JWT_SECRET),
                };
                return this.respondSuccess(res, `Success`, token);
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map