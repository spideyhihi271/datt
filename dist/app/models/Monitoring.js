"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.Monitory = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const monitorySchema = new mongoose_1.default.Schema({
    date: { type: String, required: true },
    location: { type: String, required: true },
    traps: { type: Number, required: true, default: 0 },
    result: { type: Number, require: true, default: 0 },
    note: { type: String, require: true },
}, { timestamps: true });
const validate = (monitory) => {
    const Schema = joi_1.default.object({
        date: joi_1.default.string().required(),
        location: joi_1.default.string().required(),
        traps: joi_1.default.number().required(),
        result: joi_1.default.number().min(0),
        note: joi_1.default.allow(),
    });
    return Schema.validate(monitory);
};
exports.validate = validate;
// Create Model
const Monitory = mongoose_1.default.model("Monitory", monitorySchema);
exports.Monitory = Monitory;
//# sourceMappingURL=Monitoring.js.map