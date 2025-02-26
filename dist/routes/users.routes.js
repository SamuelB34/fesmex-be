"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authLoggedUser_1 = require("../common/auth/authLoggedUser");
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const router = express_1.default.Router();
router.get("/", authLoggedUser_1.authLoggedUser, users_controller_1.default.getUsers);
exports.default = router;
//# sourceMappingURL=users.routes.js.map