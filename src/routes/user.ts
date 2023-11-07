import express, { Router } from "express";
import AuthMiddleWare from "../middleware/auth";
import UserController from "../app/controllers/UserController";
const router: Router = express.Router();

// [POST] /api/v1/user
router.post("/", [AuthMiddleWare.isManager], UserController.createNewUser);
// [POST] /api/v1/user
router.patch("/:_id", UserController.updatePassword);
// [POST] /api/v1/user
router.delete(
  "/:_id",
  [AuthMiddleWare.isManager],
  UserController.deletedUserById
);

// Export
export default router;
