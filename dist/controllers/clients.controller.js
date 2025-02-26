"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("./base.controller");
const addOrganizations_1 = require("./addOrganizations");
const clients_1 = __importDefault(require("../models/clients"));
const pipedriveLead_1 = __importDefault(require("../models/pipedriveLead"));
class ClientsController extends base_controller_1.BaseController {
    constructor() {
        super(...arguments);
        this.addClients = async (req, res, next) => {
            try {
                const clients_list = (0, addOrganizations_1.clientsLists)();
                const clients = await clients_1.default.insertMany(clients_list);
                return this.respondSuccess(res, `Records inserted successfully!`, clients);
            }
            catch (error) {
                console.error(error);
                next(error);
            }
        };
        this.addLeads = async (req, res, next) => {
            try {
                const clients_list = (0, addOrganizations_1.leadsList)();
                const leads = await pipedriveLead_1.default.insertMany(clients_list);
                return this.respondSuccess(res, `Records inserted successfully!`, leads);
            }
            catch (error) {
                console.error(error);
                next(error);
            }
        };
    }
}
exports.default = new ClientsController();
//# sourceMappingURL=clients.controller.js.map