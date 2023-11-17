"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const EmployeeController_1 = __importDefault(require("../app/controllers/EmployeeController"));
const router = express_1.default.Router();
// [POST] /api/v1/employee
router.post("/", [auth_1.default.isCensorOrManager], EmployeeController_1.default.postNewEmployee);
// [GET] /api/v1/employee
router.get("/", EmployeeController_1.default.getEmployee);
// [GET] /api/v1/employee/:_id
router.get("/:_id", EmployeeController_1.default.getEmployeeByID);
// [PATCH] /api/v1/employee/:_id
router.patch("/:_id", [auth_1.default.isManager], EmployeeController_1.default.patchEmployeeByID);
// [DELETED] /api/v1/employee/:_id
router.delete("/:_id", [auth_1.default.isManager], EmployeeController_1.default.deletedEmployeeByID);
// Export
exports.default = router;
//# sourceMappingURL=employee.js.map