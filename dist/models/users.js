"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["SALES"] = "sales";
    UserRole["TECHNICIAN"] = "technician";
    UserRole["WAREHOUSEMAN"] = "warehouseman";
})(UserRole || (exports.UserRole = UserRole = {}));
const usersSchema = new mongoose_1.default.Schema({
    first_name: { type: String, required: true },
    middle_name: { type: String },
    last_name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(UserRole),
        required: true,
        default: UserRole.SALES,
    },
    authenticated: { type: Boolean, required: true, default: false },
    email: { type: String },
    mobile: { type: String },
    created_at: { type: Date, required: true, default: Date.now },
    created_by: { type: String, required: true },
    updated_at: { type: Date },
    updated_by: { type: String },
    deleted_at: { type: Date },
    deleted_by: { type: String },
});
const User = (0, mongoose_1.model)("Users", usersSchema);
exports.default = User;
//# sourceMappingURL=users.js.map