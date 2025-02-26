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
const mongoose_1 = __importStar(require("mongoose"));
const users_1 = require("./users");
const announcementsSchema = new mongoose_1.default.Schema({
    created_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date },
    updated_by: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Users" },
    deleted_at: { type: Date },
    deleted_by: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Users" },
    title: { type: String, required: true },
    text: { type: String, required: true },
    roles: {
        type: [String],
        enum: Object.values(users_1.UserRole),
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: "At least one role must be provided to view the announcement.",
        },
    },
});
const Announcement = (0, mongoose_1.model)("Announcement", announcementsSchema);
exports.default = Announcement;
//# sourceMappingURL=announcement.js.map