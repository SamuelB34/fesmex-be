"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("./base.controller");
const addOrganizations_1 = require("./addOrganizations");
const inventory_1 = __importDefault(require("../models/inventory"));
const pipedrive = require("pipedrive");
class ProductsController extends base_controller_1.BaseController {
    constructor() {
        super(...arguments);
        this.addProduct = async (req, res, next) => {
            try {
                const products_list = (0, addOrganizations_1.productsLists)();
                const inventory = await inventory_1.default.insertMany(products_list);
                return this.respondSuccess(res, `Records inserted successfully!`, inventory);
            }
            catch (error) {
                console.error(error);
                next(error);
            }
        };
    }
}
exports.default = new ProductsController();
//# sourceMappingURL=products.controller.js.map