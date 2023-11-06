"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.Employee = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const Enum_1 = require("../../interfaces/Enum");
const employeeSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    birth: { type: Number, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
}, { timestamps: true });
const validate = (employee) => {
    const Schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        birth: joi_1.default.number().min(1000).max(9999).required(),
        gender: joi_1.default.valid(...Object.values(Enum_1.Gender)).required(),
        address: joi_1.default.string().required(),
        phone: joi_1.default.string()
            .regex(/^\d{10}$/)
            .required(),
    });
    return Schema.validate(employee);
};
exports.validate = validate;
// Create Model
const Employee = mongoose_1.default.model("Employee", employeeSchema);
exports.Employee = Employee;
//# sourceMappingURL=Employee.js.map