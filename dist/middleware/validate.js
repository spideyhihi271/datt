"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class ValidateMiddleWare {
    signIn(req, res, next) {
        const data = req.body;
        const schema = joi_1.default.object({
            email: joi_1.default.string().required(),
            password: joi_1.default.string().required(),
        });
        const { error } = schema.validate(data);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        else
            next();
    }
}
exports.default = new ValidateMiddleWare();
//# sourceMappingURL=validate.js.map