"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes"));
exports.app = (0, express_1.default)();
exports.app.use(body_parser_1.default.json({
    limit: "20mb",
}));
exports.app.use("/graphql", body_parser_1.default.json());
exports.app.use("/pipedrive", routes_1.default);
//# sourceMappingURL=app.js.map