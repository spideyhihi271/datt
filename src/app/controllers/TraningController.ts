import { Request, Response } from "express";
import { IDataTrainingXlsx } from "../../interfaces/IDataExcel";
import { ITraining } from "../../interfaces/ITraining";
import { Training, validate } from "../models/Training";
import mongoose from "mongoose";
import createSort from "../../utils/createSort";
import createPagination from "utils/createPagination";
import { IPagination } from "interfaces/IPagination";

const isExist = async (_id: string) => {
  // Validate
  if (!mongoose.Types.ObjectId.isValid(_id)) return undefined;
  // Get
  const trainning = await Training.findById(_id).exec();
  if (!trainning) return undefined;
  return trainning;
};
class TrainingController {
  async saveFromFile(data: IDataTrainingXlsx[], req: Request, res: Response) {
    try {
      data.forEach(async (trainning: IDataTrainingXlsx) => {
        const data: ITraining = {
          date: trainning["Ngày, Tháng, Năm"],
          content: trainning["Nội dung tập huấn/ đào tạo"],
          organizingUnit: trainning["Đơn vị tổ chức"],
          trainer: trainning["Giảng viên tập huấn/đào tạo"],
        };
        // Validate
        const { error } = validate(data);
        if (error)
          return res.status(403).send({ message: error.details[0].message });
        // Save
        await new Training(data).save();
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async postNewTraining(req: Request, res: Response) {
    try {
      const data: ITraining = req.body;
      // Validate
      const { error } = validate(data);
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      // Saving
      await new Training(data).save();
      return res.status(200).send({
        message: "New Traning was saved",
        data,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async getTraining(req: Request, res: Response) {
    try {
      const params: any = req.query;
      const keyword: string = params.q ? params.q : "";
      const page: number = params.page ? parseInt(params.page) - 1 : 0;
      const limit: number = params.limit ? parseInt(params.limit) : 20;
      const skip: number = page * limit;
      const sort: {} = createSort(params.sort);
      // Query
      const trainingQuery = Training.find({
        name: { $regex: keyword, $options: "i" },
      })
        .sort(sort)
        .skip(skip)
        .limit(limit);
      const paginationQuery = Training.countDocuments({
        name: { $regex: keyword, $options: "i" },
      });

      // Get data
      const trainning = await trainingQuery.exec();
      const total = await paginationQuery.exec();
      const data: IPagination = createPagination(trainning, total, 20, params);
      return res.status(200).send(data);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getTrainingById(req: Request, res: Response) {
    try {
      const _id = req.params._id;
      const traning = await isExist(_id);
      if (!traning)
        return res.status(404).send({
          message: "Not Found",
        });
      return res.status(200).send({
        data: traning,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async patchTrainingById(req: Request, res: Response) {
    const _id: string = req.params._id;
    const data: any = req.body;
    const target = await isExist(_id);
    // Not Found
    if (!target)
      return res.status(404).send({
        message: "Not found",
      });
    // Validate
    const { date, content, organizingUnit, trainer, ...orther } = target;
    const update: ITraining = Object.assign(
      { date, content, organizingUnit, trainer },
      data
    );
    const { error } = validate(update);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    // Update
    const response = await Training.findByIdAndUpdate(_id, update);
    return res.status(200).send({
      message: "Employee was updated!",
      data: update,
    });
  }
  async deletedTrainingById(req: Request, res: Response) {
    try {
      const _id: string = req.params._id;
      const training = await isExist(_id);
      // Not Found
      if (!training)
        return res.status(404).send({
          message: "Not found",
        });
      // Deleted
      await Training.findByIdAndDelete(_id);
      return res.status(200).send({
        message: "Traning was deleted",
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new TrainingController();
