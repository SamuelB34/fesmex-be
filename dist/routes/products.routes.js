"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authLoggedUser_1 = require("../common/auth/authLoggedUser");
const products_controller_1 = __importDefault(require("../controllers/products.controller"));
const clients_controller_1 = __importDefault(require("../controllers/clients.controller"));
const router = express_1.default.Router();
router.get("/", authLoggedUser_1.authLoggedUser, products_controller_1.default.addProduct);
router.get("/clients", authLoggedUser_1.authLoggedUser, clients_controller_1.default.addClients);
router.get("/leads", authLoggedUser_1.authLoggedUser, clients_controller_1.default.addLeads);
exports.default = router;
//# sourceMappingURL=products.routes.js.map