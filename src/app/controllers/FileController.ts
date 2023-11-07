import axios from "axios";
import { Response } from "express";
import { IFile, IFileUpload } from "interfaces/IFile";
import { IRequestWithUser } from "interfaces/IRequest";
import mongoose from "mongoose";
import xlsx from "xlsx";
import { Role, StatusFile, TypeFile } from "../../interfaces/Enum";
import { IPagination } from "../../interfaces/IPagination";
import { IParamsGetFile } from "../../interfaces/IParam";
import FileServices from "../../services/firebase";
import createPagination from "../../utils/createPagination";
import createSort from "../../utils/createSort";
import { File, validate } from "../models/File";
import EmployeeController from "./EmployeeController";
import EquipController from "./EquipController";
import MonitoringController from "./MonitoringController";
import TraningController from "./TraningController";

const isFileExist = async (_id: string) => {
  // Validate
  if (!mongoose.Types.ObjectId.isValid(_id)) return undefined;
  // Get
  const file = await File.findById(_id).exec();
  if (!file) return undefined;
  return file;
};
class FileController {
  async postNewFile(req: IRequestWithUser, res: Response) {
    try {
      if (!req.file)
        return res.status(403).send({
          message: "No file",
        });
      const file = await FileServices.uploadFile(req, res);
      const data: IFileUpload = {
        name: file.name,
        owner: req.user._id,
        type: req.body.type,
        url: file.downloadURL,
      };
      const { error } = validate(data);
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      const newFile = await new File(data).save();
      return res
        .status(200)
        .send({ message: "Your file was upload successfull", data: newFile });
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAllFile(req: IRequestWithUser, res: Response) {
    try {
      const params: IParamsGetFile = req.query;
      const keyword: string = params.q ? params.q : "";
      const typeFiles: string[] = params.type
        ? params.type.split(",")
        : Object.values(TypeFile);
      const status: string[] = params.status
        ? params.status.split(",")
        : Object.values(StatusFile);
      const sort: {} = createSort(params.sort);
      const page: number = (parseInt(params.page) - 1) | 0;
      const limit: number = params.limit ? parseInt(params.limit) : 20;
      const skip: number = page * limit;
      const filter: {}[] = [
        {
          name: { $regex: keyword, $options: "i" },
        },
        {
          type: { $in: typeFiles },
        },
        {
          status: { $in: status },
        },
        {
          deleted: false,
        },
      ];
      // If Staff you only can see your file;
      if (req.user.role === Role.Staff)
        filter.push({
          owner: req.user._id,
        });
      // Queries
      const getFilesQuery = File.find({
        $and: filter,
      })
        .sort(sort)
        .skip(skip)
        .limit(limit);
      const paginationQuery = File.countDocuments({
        $and: filter,
      });
      // Data
      const files = await getFilesQuery.exec();
      const total = await paginationQuery.exec();
      const data: IPagination = createPagination(files, total, 20, params);
      return res.status(200).send({ data });
    } catch (error) {
      throw new Error(error);
    }
  }
  async getFileByID(req: IRequestWithUser, res: Response) {
    try {
      const _id: string = req.params._id;
      const file: any = await isFileExist(_id);
      if (!file)
        return res.status(404).send({
          message: "Not Found",
        });
      // IF you are staff you can't watch another file
      if (req.user.role === Role.Staff) {
        if (file._id != req.user._id)
          return res.status(403).send({
            message: "Access denied for this action",
          });
      }
      return res.status(200).send({
        data: file,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async approveFileByID(req: IRequestWithUser, res: Response) {
    const _id = req.params._id;
    const file: IFile = await isFileExist(_id);
    if (!file) return res.status(404).send({ message: "Not found" });
    // Aprove
    const approveStatus =
      req.user.role === Role.Manager
        ? StatusFile.passManager
        : StatusFile.passCensor;
    // Update
    const { name, owner, type, url, deleted } = file;
    const update: IFile = {
      name,
      owner,
      type,
      url,
      deleted,
      status: approveStatus,
    };
    const response = await File.findByIdAndUpdate(_id, update);
    return res
      .status(200)
      .send({ message: "This file was approve", data: update });
  }
  async rejectFileByID(req: IRequestWithUser, res: Response) {
    const _id = req.params._id;
    const file: IFile = await isFileExist(_id);
    if (!file) return res.status(404).send({ message: "Not found" });
    // Update
    const { name, owner, type, url, deleted } = file;
    const update: IFile = {
      name,
      owner,
      type,
      url,
      deleted,
      status: StatusFile.reject,
    };
    const response = await File.findByIdAndUpdate(_id, update);
    return res
      .status(200)
      .send({ message: "This file was rejected", data: update });
  }
  async patchFileByID(req: IRequestWithUser, res: Response) {
    const _id = req.params._id;
    const file: IFile = await isFileExist(_id);
    if (!req.file)
      return res.status(403).send({
        message: "No file",
      });
    const fileUpload = await FileServices.uploadFile(req, res);
    const { owner, type, deleted } = file;
    const update: IFile = Object.assign(
      { owner, type, deleted },
      {
        name: fileUpload.name,
        status: StatusFile.pending,
        url: fileUpload.downloadURL,
      }
    );
    // Save
    const response = await File.findByIdAndUpdate(_id, update);
    return res.status(200).send({
      message: "File was update",
      data: update,
    });
  }
  async saveOnDB(req: IRequestWithUser, res: Response) {
    try {
      const _id: string = req.params._id;
      const file: IFile | undefined = await isFileExist(_id);
      if (!file)
        return res.status(404).send({
          message: "Not Found",
        });
      else {
        // GET Data
        let fileXlsx: any = await axios.get(file.url, {
          responseType: "arraybuffer",
        });
        // ReadFile
        const workbook = xlsx.read(fileXlsx.data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: any = xlsx.utils.sheet_to_json(worksheet);
        // SAVE
        switch (file.type) {
          case TypeFile.HR:
            await EmployeeController.saveFromFile(data, req, res);
            break;
          case TypeFile.Equipment:
            await EquipController.saveFromFile(data, req, res);
          case TypeFile.Monitory:
            await MonitoringController.saveFromFile(data, req, res);
          case TypeFile.Training:
            await TraningController.saveFromFile(data, req, res);
          default:
            break;
        }
        // Return
        return res.status(200).send({
          message: "Save on DB was successfull",
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new FileController();
