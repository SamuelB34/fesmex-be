"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deals_routes_1 = __importDefault(require("./deals.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const products_routes_1 = __importDefault(require("./products.routes"));
const router = express_1.default.Router();
router.use("/deals", deals_routes_1.default);
router.use("/users", users_routes_1.default);
router.use("/products", products_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map