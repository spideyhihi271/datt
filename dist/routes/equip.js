"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EquipController_1 = __importDefault(require("../app/controllers/EquipController"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// [POST] /api/v1/employee
router.post("/", [auth_1.default.isCensorOrManager], EquipController_1.default.postNewEquid);
// [GET] /api/v1/employee
router.get("/", EquipController_1.default.getEquips);
// [GET] /api/v1/employee/:_id
router.get("/:_id", EquipController_1.default.getEquipByID);
// [PATCH] /api/v1/employee/:_id
router.patch("/:_id", [auth_1.default.isManager], EquipController_1.default.patchEquipByID);
// [DELETED] /api/v1/employee/:_id
router.delete("/:_id", [auth_1.default.isManager], EquipController_1.default.deletedEquipByID);
// Export
exports.default = router;
//# sourceMappingURL=equip.js.map