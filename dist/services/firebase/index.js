"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
const firebase_1 = __importDefault(require("../../configs/firebase"));
const getTimes_1 = require("../../utils/getTimes");
//Initialize a firebase application
(0, app_1.initializeApp)(firebase_1.default.firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const storage = (0, storage_1.getStorage)();
class FirebaseService {
    async uploadFile(req, res) {
        try {
            const times = (0, getTimes_1.getCurrentTime)();
            const storageRef = (0, storage_1.ref)(storage, req.user._id + times + ".xlsx");
            const metadata = {
                contentType: req.file.mimetype,
            };
            const snapshot = await (0, storage_1.uploadBytesResumable)(storageRef, req.file.buffer, metadata);
            const downloadURL = await (0, storage_1.getDownloadURL)(snapshot.ref);
            const data = {
                status: "success",
                name: req.file.originalname,
                type: req.file.mimetype,
                downloadURL: downloadURL,
            };
            return data;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async dowloadFile() { }
}
exports.default = new FirebaseService();
//# sourceMappingURL=index.js.map