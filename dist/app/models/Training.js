"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.Training = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const trainingSchema = new mongoose_1.default.Schema({
    date: { type: String, required: true },
    content: { type: String, required: true },
    organizingUnit: { type: String, required: true },
    trainer: { type: String, required: true },
}, { timestamps: true });
const validate = (training) => {
    const Schema = joi_1.default.object({
        date: joi_1.default.string().required(),
        content: joi_1.default.string().required(),
        organizingUnit: joi_1.default.string().required(),
        trainer: joi_1.default.string().required(),
    });
    return Schema.validate(training);
};
exports.validate = validate;
// Create Model
const Training = mongoose_1.default.model("Training", trainingSchema);
exports.Training = Training;
//# sourceMappingURL=Training.js.map