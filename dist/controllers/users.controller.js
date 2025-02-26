"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("./base.controller");
const pipedrive = require("pipedrive");
class UsersController extends base_controller_1.BaseController {
    constructor() {
        super(...arguments);
        this.getUsers = async (req, res, next) => {
            try {
                const apiClient = new pipedrive.ApiClient();
                // Configure API key authorization: apiToken
                let apiToken = apiClient.authentications.api_key;
                apiToken.apiKey = process.env.PIPEDRIVE_API_KEY;
                const api = new pipedrive.UsersApi(apiClient);
                const { data } = await api.getUsers();
                const res_value = {
                    count: data.length,
                    data: data,
                };
                return this.respondSuccess(res, `Success`, res_value);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = new UsersController();
//# sourceMappingURL=users.controller.js.map