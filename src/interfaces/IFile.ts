import { Schema } from "mongoose";
import { TypeFile, StatusFile } from "./Enum";

export interface IFileUpload {
  name: string;
  owner: Schema.Types.ObjectId;
  url: string;
  type: TypeFile;
}

export interface IFile extends IFileUpload {
  status: StatusFile;
  deleted: boolean;
}

export interface IResultFile {
  status: "success" | "error";
  name: string;
  type: string;
  downloadURL: string;
}

export interface IGetFiles {
  status: string;
  sort: string;
}
