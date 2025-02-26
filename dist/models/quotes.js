"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const companyContactSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
});
const articleExtraSchema = new mongoose_1.Schema({
    multiplier: { type: Number, required: false },
    usa_freight: { type: Number, required: false },
    usa_expenses: { type: Number, required: false },
    duty: { type: Number, required: false },
    mex_freight: { type: Number, required: false },
});
const articleSchema = new mongoose_1.Schema({
    article_number: { type: String, required: true },
    delivery: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    original_price: { type: Number, required: true },
    total: { type: Number, required: true },
    utility: { type: Number, required: true },
    extra: { type: articleExtraSchema, required: false },
});
const quotesSchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    quote_number: { type: Number, required: true },
    quote_revision: { type: Number, required: true },
    quote_ref: { type: String, required: true },
    company: { type: String, required: true },
    company_contact: { type: companyContactSchema, required: true },
    project_name: { type: String, required: true },
    project_lab: { type: String, required: true },
    payment_condition: { type: String, required: true },
    payment_exp: { type: String, required: true },
    article: { type: [articleSchema], required: true },
    created_by: { type: String, required: true, ref: "Users" },
});
const QuotesModel = (0, mongoose_1.model)("Quotes", quotesSchema);
exports.default = QuotesModel;
//# sourceMappingURL=quotes.js.map