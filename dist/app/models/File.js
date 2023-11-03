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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.File = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importStar(require("mongoose"));
const Enum_1 = require("../../interfaces/Enum");
const fileSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true, default: Enum_1.StatusFile.pending },
    deleted: { type: Boolean, required: true, default: false },
}, { timestamps: true });
const validate = (file) => {
    const Schema = joi_1.default.object({
        name: joi_1.default.string().required().min(1).max(500),
        owner: joi_1.default.string().required(),
        url: joi_1.default.string().required(),
        type: joi_1.default.valid(...Object.values(Enum_1.TypeFile)).required(),
    });
    return Schema.validate(file);
};
exports.validate = validate;
// Create Model
const File = mongoose_1.default.model("File", fileSchema);
exports.File = File;
//# sourceMappingURL=File.js.map