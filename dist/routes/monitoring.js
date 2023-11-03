"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const MonitoringController_1 = __importDefault(require("../app/controllers/MonitoringController"));
const router = express_1.default.Router();
router.post("/", [auth_1.default.isCensorOrManager], MonitoringController_1.default.postNewMonitories);
router.get("/", MonitoringController_1.default.getMonitories);
router.get("/:_id", MonitoringController_1.default.getMonitoryById);
exports.default = router;
//# sourceMappingURL=monitoring.js.map