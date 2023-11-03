import express, { Router } from "express";
import AuthMiddleWare from "../middleware/auth";
import MonitoringController from "../app/controllers/MonitoringController";
const router: Router = express.Router();

router.post(
  "/",
  [AuthMiddleWare.isCensorOrManager],
  MonitoringController.postNewMonitories
);

router.get("/", MonitoringController.getMonitories);
router.get("/:_id", MonitoringController.getMonitoryById);

export default router;
