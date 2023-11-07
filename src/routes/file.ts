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
// [PATCH] /api/v1/file/aprrove/_id
router.patch(
  "/approve/:_id",
  [AuthMiddleware.isCensorOrManager],
  FileController.approveFileByID
);
// [PATCH] /api/v1/file/reject/_id
router.patch(
  "/reject/:_id",
  [AuthMiddleware.isCensorOrManager],
  FileController.rejectFileByID
);
// [PATCH] /api/v1/file/_id
router.patch(
  "/:_id",
  upload.single("file"),
  [AuthMiddleware.isCensorOrManager],
  FileController.patchFileByID
);
// [POST] /api/v1/file/save/_id
router.post("/save/:_id", [AuthMiddleware.isManager], FileController.saveOnDB);

export default router;
