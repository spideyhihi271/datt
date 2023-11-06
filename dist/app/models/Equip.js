"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.Equid = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const equipSchema = new mongoose_1.default.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    origin: { type: String, required: true, default: " " },
    manufactureYear: {
        type: String,
        required: true,
        default: " ",
    },
    note: { type: String, default: " " },
}, { timestamps: true });
const validate = (equid) => {
    const Schema = joi_1.default.object({
        code: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        quantity: joi_1.default.number().min(1).required(),
        origin: joi_1.default.allow(),
        manufactureYear: joi_1.default.allow(),
        note: joi_1.default.allow(),
    });
    return Schema.validate(equid);
};
exports.validate = validate;
// Create Model
const Equid = mongoose_1.default.model("Equid", equipSchema);
exports.Equid = Equid;
//# sourceMappingURL=Equip.js.map