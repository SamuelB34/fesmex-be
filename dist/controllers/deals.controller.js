"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dateFunctions_1 = require("../common/auth/dateFunctions");
const axios_1 = __importDefault(require("axios"));
const base_controller_1 = require("./base.controller");
const addOrganizations_1 = require("./addOrganizations");
class DealsController extends base_controller_1.BaseController {
    constructor() {
        super(...arguments);
        this.getDeals = async (req, res, next) => {
            try {
                const dates = (0, dateFunctions_1.getCurrentWeekRange)();
                const response = await axios_1.default.get("https://api.pipedrive.com/api/v2/deals", {
                    params: {
                        api_token: process.env.PIPEDRIVE_API_KEY,
                        updated_since: dates.start,
                        updated_until: dates.end,
                        status: "won",
                    },
                });
                const { data } = response;
                const res_data = {
                    count: data.data.length,
                    data: data.data,
                };
                return this.respondSuccess(res, `Success`, res_data);
            }
            catch (error) {
                next(error);
            }
        };
        this.createDeal = async (req, res, next) => {
            try {
                const { title, value, currency, status, add_time, owner_id } = req.body;
                if (!title || !value || !currency) {
                    return this.respondInvalid(res);
                }
                const response = await axios_1.default.post("https://api.pipedrive.com/api/v2/deals", {
                    title,
                    value,
                    currency,
                    status,
                    owner_id,
                    add_time: add_time || (0, dateFunctions_1.getCurrentDateTime)(),
                }, {
                    params: {
                        api_token: process.env.PIPEDRIVE_API_KEY, // API Key
                    },
                });
                const { data } = response;
                console.log("HOLAAA");
                return this.respondSuccess(res, `Deal added successfully`, data.data);
            }
            catch (error) {
                console.error(error);
                next(error);
            }
        };
        this.createOrganization = async (req, res, next) => {
            try {
                const x = req.body;
                if (!x.name) {
                    return this.respondInvalid(res);
                }
                const clients_list = (0, addOrganizations_1.orgLists)();
                // for (let i = 0; i < 2; i++) {
                // 	const response = await axios.post(
                // 		"https://api.pipedrive.com/v1/organizations",
                // 		{
                // 			name: clients_list[i]["Nombre SN"],
                // 			b60d43f481072d08b68b4494ab7670a785ded1b6:
                // 				clients_list[i]["Teléfono 1"],
                //
                // 		},
                // 		{
                // 			params: {
                // 				api_token: process.env.PIPEDRIVE_API_KEY, // API Key
                // 			},
                // 		}
                // 	)
                //
                // 	const { data } = response
                // 	console.log("Record ", i, " insertado")
                // }
                return this.respondSuccess(res, `Deal added successfully`, {
                    clients_list,
                });
            }
            catch (error) {
                console.error(error);
                next(error);
            }
        };
    }
}
exports.default = new DealsController();
//# sourceMappingURL=deals.controller.js.map