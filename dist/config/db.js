"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/fesmex";
const connect = () => {
    console.log(DB_URI);
    mongoose_1.default
        .connect(DB_URI)
        .then(() => {
        console.log("Connected to the database! ✅✅✅");
    })
        .catch((err) => {
        console.error("Connection error 💥💥💥", err);
    });
};
exports.default = { connect };
//# sourceMappingURL=db.js.map