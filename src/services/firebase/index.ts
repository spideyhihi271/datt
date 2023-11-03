import { Response } from "express";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { IRequestWithUser } from "interfaces/IRequest";

import configs from "../../configs/firebase";
import { getCurrentTime } from "../../utils/getTimes";
import { IResultFile } from "interfaces/IFile";

//Initialize a firebase application
initializeApp(configs.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

class FirebaseService {
  async uploadFile(req: IRequestWithUser, res: Response) {
    try {
      const times = getCurrentTime();
      const storageRef = ref(storage, req.user._id + times + ".xlsx");
      const metadata = {
        contentType: req.file.mimetype,
      };
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      const downloadURL = await getDownloadURL(snapshot.ref);
      const data: IResultFile = {
        status: "success",
        name: req.file.originalname,
        type: req.file.mimetype,
        downloadURL: downloadURL,
      };
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
  async dowloadFile() {}
}

export default new FirebaseService();
