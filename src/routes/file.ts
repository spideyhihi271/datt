import express, { Router } from "express";
import FileController from "../app/controllers/FileController";
import multer from "multer";
import AuthMiddleware from "../middleware/auth";
const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// [POST] /api/v1/file
router.post("/", upload.single("file"), FileController.postNewFile);
// [GET] /api/v1/file
router.get("/", FileController.getAllFile);
// [GET] /api/v1/file/_id
router.get("/:_id", FileController.getFileByID);
// [POST] /api/v1/file/save/_id
router.post("/save/:_id", [AuthMiddleware.isManager], FileController.saveOnDB);

export default router;
