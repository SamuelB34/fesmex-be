"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authLoggedUser_1 = require("../common/auth/authLoggedUser");
const deals_controller_1 = __importDefault(require("../controllers/deals.controller"));
const router = express_1.default.Router();
router.get("/", authLoggedUser_1.authLoggedUser, deals_controller_1.default.getDeals);
router.post("/", authLoggedUser_1.authLoggedUser, deals_controller_1.default.createDeal);
router.post("/org", authLoggedUser_1.authLoggedUser, deals_controller_1.default.createOrganization);
exports.default = router;
//# sourceMappingURL=deals.routes.js.map