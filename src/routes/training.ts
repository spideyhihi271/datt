import express, { Router } from "express";
import AuthMiddleWare from "../middleware/auth";
import TraningController from "../app/controllers/TraningController";
const router: Router = express.Router();

// [POST] /api/v1/employee
router.post(
  "/",
  [AuthMiddleWare.isCensorOrManager],
  TraningController.postNewTraining
);
// [GET] /api/v1/employee
router.get("/", TraningController.getTraining);
// [GET] /api/v1/employee/:_id
router.get("/:_id", TraningController.getTrainingById);
// [PATCH] /api/v1/employee/:_id
router.patch(
  "/:_id",
  [AuthMiddleWare.isManager],
  TraningController.patchTrainingById
);
// [DELETED] /api/v1/employee/:_id
router.delete(
  "/:_id",
  [AuthMiddleWare.isManager],
  TraningController.deletedTrainingById
);

// Export
export default router;
