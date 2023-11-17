import express, { Router } from "express";
import AuthMiddleWare from "../middleware/auth";
import EmployeeController from "../app/controllers/EmployeeController";
const router: Router = express.Router();

// [POST] /api/v1/employee
router.post(
  "/",
  [AuthMiddleWare.isCensorOrManager],
  EmployeeController.postNewEmployee
);
// [GET] /api/v1/employee
router.get("/", EmployeeController.getEmployee);
// [GET] /api/v1/employee/:_id
router.get("/:_id", EmployeeController.getEmployeeByID);
// [PATCH] /api/v1/employee/:_id
router.patch(
  "/:_id",
  [AuthMiddleWare.isManager],
  EmployeeController.patchEmployeeByID
);
// [DELETED] /api/v1/employee/:_id
router.delete(
  "/:_id",
  [AuthMiddleWare.isManager],
  EmployeeController.deletedEmployeeByID
);

// Export
export default router;
