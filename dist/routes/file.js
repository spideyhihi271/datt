"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const FileController_1 = __importDefault(require("../app/controllers/FileController"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// [POST] /api/v1/file
router.post("/", upload.single("file"), FileController_1.default.postNewFile);
// [GET] /api/v1/file
router.get("/", FileController_1.default.getAllFile);
// [GET] /api/v1/file/_id
router.get("/:_id", FileController_1.default.getFileByID);
// [POST] /api/v1/file/save/_id
router.post("/save/:_id", [auth_1.default.isManager], FileController_1.default.saveOnDB);
exports.default = router;
//# sourceMappingURL=file.js.map