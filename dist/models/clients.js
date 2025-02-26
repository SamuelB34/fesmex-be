"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const contactSchema = new mongoose_1.Schema({
    contact_person_name: { type: String, default: null },
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    contact_phone: { type: String, default: null },
    contact_email: { type: String, default: null },
});
const clientSchema = new mongoose_1.Schema({
    sn_code: { type: String, default: null },
    sn_name: { type: String, default: null },
    tax_id: { type: String, default: null },
    currency: { type: String, default: null },
    phone_1: { type: String, default: null },
    email: { type: String, default: null },
    sales_department_employee_code: { type: String, default: null },
    sales_department_employee_name: { type: String, default: null },
    payment_terms_code: { type: String, default: null },
    payment_terms_name: { type: String, default: null },
    price_list_number: { type: String, default: null },
    price_list_name: { type: String, default: null },
    address_name: { type: String, default: null },
    street: { type: String, default: null },
    neighborhood: { type: String, default: null },
    postal_code: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country_region: { type: String, default: null },
    payment_method_code: { type: String, default: null },
    payment_method_description: { type: String, default: null },
    comments: { type: String, default: null },
    contacts: { type: [contactSchema], default: [] }, // Array de objetos contactSchema
});
const Client = (0, mongoose_1.model)("Client", clientSchema);
exports.default = Client;
//# sourceMappingURL=clients.js.map