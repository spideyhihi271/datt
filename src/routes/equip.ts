import express, { Router } from "express";
import EquipController from "../app/controllers/EquipController";
import AuthMiddleware from "../middleware/auth";
const router: Router = express.Router();

// [POST] /api/v1/employee
router.post(
  "/",
  [AuthMiddleware.isCensorOrManager],
  EquipController.postNewEquid
);
// [GET] /api/v1/employee
router.get("/", EquipController.getEquips);
// [GET] /api/v1/employee/:_id
router.get("/:_id", EquipController.getEquipByID);
// [PATCH] /api/v1/employee/:_id
router.patch("/:_id", EquipController.patchEquipByID);
// [DELETED] /api/v1/employee/:_id
router.delete("/:_id", EquipController.deletedEquipByID);

// Export
export default router;
