"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Enum_1 = require("../interfaces/Enum");
class AuthMiddleWare {
    authenticated(req, res, next) {
        let token = req.headers.authorization;
        if (!token)
            return res.status(403).send({
                message: "You are not authenticated",
            });
        token = token.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SERECT_KEY, (err, data) => {
            if (err)
                return res.status(403).send({
                    message: "Your token is not valid",
                });
            req.user = data;
            next();
        });
    }
    isCensorOrManager(req, res, next) {
        const rolesCanApprove = [Enum_1.Role.Censor, Enum_1.Role.Manager];
        const canApprove = rolesCanApprove.find((role) => role === req.user.role)
            ? true
            : false;
        if (!canApprove)
            return res.status(403).send({
                message: "Access Denied for this action.",
            });
        next();
    }
    isManager(req, res, next) {
        const isManager = req.user.role === Enum_1.Role.Manager ? true : false;
        if (!isManager)
            return res.status(403).send({
                message: "Access denied for this action",
            });
        next();
    }
}
exports.default = new AuthMiddleWare();
//# sourceMappingURL=auth.js.map