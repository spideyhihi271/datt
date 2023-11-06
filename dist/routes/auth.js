"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../app/controllers/AuthController"));
const validate_1 = __importDefault(require("../middleware/validate"));
const router = express_1.default.Router();
// [POST] /auth/signin
router.post("/signin", validate_1.default.signIn, AuthController_1.default.signIn);
// [POST] /auth/refresh
router.post("/refresh", AuthController_1.default.refreshToken);
// [POST] /auth/logout
router.post("/logout", AuthController_1.default.logout);
exports.default = router;
//# sourceMappingURL=auth.js.map