"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pipedriveLeadSchema = new mongoose_1.Schema({
    psn_code: { type: String, default: null },
    sn_name: { type: String, default: null },
    contact_person_name: { type: String, default: null },
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    contact_phone: { type: String, default: null },
    contact_email: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    lcsn_code: { type: String, default: null },
    losn_code: { type: String, default: null },
});
const PipedriveLead = (0, mongoose_1.model)("PipedriveLead", pipedriveLeadSchema);
exports.default = PipedriveLead;
//# sourceMappingURL=pipedriveLead.js.map