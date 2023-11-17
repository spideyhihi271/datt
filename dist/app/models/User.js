"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.User = void 0;
const joi_1 = __importDefault(require("joi"));
const joi_password_complexity_1 = __importDefault(require("joi-password-complexity"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const Enum_1 = require("../../interfaces/Enum");
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
}, { timestamps: true });
// Menthods
userSchema.methods.generateToken = function () {
    const token = jsonwebtoken_1.default.sign({
        _id: this._id,
        email: this.email,
        role: this.role,
    }, process.env.TOKEN_SERECT_KEY, {
        expiresIn: "2h",
    });
    return token;
};
userSchema.methods.generateRefreshToken = function () {
    const refreshToken = jsonwebtoken_1.default.sign({
        _id: this._id,
        email: this.email,
        role: this.role,
    }, process.env.REFRESH_SERECT_KEY, {
        expiresIn: "7d",
    });
    return refreshToken;
};
const validate = (user) => {
    const Schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: (0, joi_password_complexity_1.default)().required(),
        role: joi_1.default.valid(...Object.values(Enum_1.Role)).required(),
    });
    return Schema.validate(user);
};
exports.validate = validate;
// Create Model
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
//# sourceMappingURL=User.js.map