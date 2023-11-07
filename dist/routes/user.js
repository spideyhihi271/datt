"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const UserController_1 = __importDefault(require("../app/controllers/UserController"));
const router = express_1.default.Router();
// [POST] /api/v1/user
router.post("/", [auth_1.default.isManager], UserController_1.default.createNewUser);
// [POST] /api/v1/user
router.patch("/:_id", UserController_1.default.updatePassword);
// [POST] /api/v1/user
router.delete("/:_id", [auth_1.default.isManager], UserController_1.default.deletedUserById);
// Export
exports.default = router;
//# sourceMappingURL=user.js.map