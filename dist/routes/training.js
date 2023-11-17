"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const TraningController_1 = __importDefault(require("../app/controllers/TraningController"));
const router = express_1.default.Router();
// [POST] /api/v1/employee
router.post("/", [auth_1.default.isCensorOrManager], TraningController_1.default.postNewTraining);
// [GET] /api/v1/employee
router.get("/", TraningController_1.default.getTraining);
// [GET] /api/v1/employee/:_id
router.get("/:_id", TraningController_1.default.getTrainingById);
// [PATCH] /api/v1/employee/:_id
router.patch("/:_id", [auth_1.default.isManager], TraningController_1.default.patchTrainingById);
// [DELETED] /api/v1/employee/:_id
router.delete("/:_id", [auth_1.default.isManager], TraningController_1.default.deletedTrainingById);
// Export
exports.default = router;
//# sourceMappingURL=training.js.map