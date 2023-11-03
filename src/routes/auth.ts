import express, { Router } from "express";
import AuthController from "../app/controllers/AuthController";
import ValidateMiddleWare from "../middleware/validate";
const router: Router = express.Router();

// [POST] /auth/signin
router.post("/signin", ValidateMiddleWare.signIn, AuthController.signIn);
// [POST] /auth/refresh
router.post("/refresh", AuthController.refreshToken);
// [POST] /auth/logout
router.post("/logout", AuthController.logout);

export default router;
