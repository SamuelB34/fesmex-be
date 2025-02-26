"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = exports.Class = exports.Currency = void 0;
const mongoose_1 = require("mongoose");
var Currency;
(function (Currency) {
    Currency["USD"] = "USD";
    Currency["MXP"] = "MXP";
    Currency["EUR"] = "EUR";
    Currency["EMPTY"] = "";
})(Currency || (exports.Currency = Currency = {}));
var Class;
(function (Class) {
    Class["ARTICULO"] = "articulo";
    Class["VIAJES"] = "viajes";
    Class["TRABAJO"] = "trabajo";
})(Class || (exports.Class = Class = {}));
var Group;
(function (Group) {
    Group["ACCS_BOMBEO"] = "ACCS BOMBEO";
    Group["ACCS_HIDRONICOS"] = "ACCS HIDRONICOS";
    Group["ARTICULOS"] = "Art\u00EDculos";
    Group["BOMBAS"] = "BOMBAS";
    Group["CONTROL_Y_AUT"] = "CONTROL Y AUT.";
    Group["DISTRIB_AIRE"] = "DISTRIB. AIRE";
    Group["INGENIERIA"] = "INGENIERIA";
    Group["MOTORES"] = "MOTORES";
    Group["PAQUETE_DE_BOMBEO"] = "PAQUETE DE BOMBEO";
    Group["PUMP_KITS"] = "PUMP KITS";
    Group["REFACCIONES"] = "REFACCIONES";
    Group["VENTILACION"] = "VENTILACION";
    Group["VENTILADORES_HVLS"] = "VENTILADORES HVLS";
})(Group || (exports.Group = Group = {}));
const inventorySchema = new mongoose_1.Schema({
    article_number: { type: String, required: true },
    description: { type: String },
    count: { type: Number, required: true },
    sat_code: { type: String, required: false, default: null },
    unit: { type: String },
    brand: { type: String },
    group: {
        type: String,
        enum: Object.values(Group),
        required: true,
    },
    SubClase: { type: String, required: false, default: null },
    model: { type: String, required: false, default: null },
    price: { type: Number, required: false, default: 0 },
    currency: {
        type: String,
        enum: Object.values(Currency),
        required: false,
        default: Currency.EMPTY,
    },
});
const Inventory = (0, mongoose_1.model)("Inventory", inventorySchema);
exports.default = Inventory;
//# sourceMappingURL=inventory.js.map