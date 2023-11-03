import { Request, Response } from "express";
import { IDataMonitoryXlsx } from "../../interfaces/IDataExcel";
import { IMonitory } from "../../interfaces/IMonitory";
import { Monitory, validate } from "../models/Monitoring";
import { IParamsGetMonitory } from "interfaces/IParam";
import createSort from "../../utils/createSort";
import { IPagination } from "../../interfaces/IPagination";
import createPagination from "../../utils/createPagination";
import mongoose from "mongoose";

const isMonitotyExist = async (_id: string) => {
  // Valid date
  if (!mongoose.Types.ObjectId.isValid(_id)) return undefined;
  const monitory = await Monitory.findById(_id);
  if (!monitory) return undefined;
  return monitory;
};

class MonitoringController {
  async saveFromFile(data: IDataMonitoryXlsx[], req: Request, res: Response) {
    try {
      data.forEach(async (monitory: IDataMonitoryXlsx) => {
        const data: IMonitory = {
          date: monitory["Ngày tháng"],
          location: monitory["Địa điểm"],
          traps: monitory["Số bẫy x số đếm"],
          result: monitory["Số chuột bẫy được"],
          note: monitory["Ghi chú"] ? monitory["Ghi chú"] : "",
        };
        // Validate
        const { error } = validate(data);
        if (error)
          return res.status(400).send({ message: error.details[0].message });
        await new Monitory(data).save();
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async postNewMonitories(req: Request, res: Response) {
    try {
      const data: IMonitory = req.body;
      const { error } = validate(data);
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      const newMonotory = await new Monitory(data).save();
      return res.status(200).send({
        message: "New Monotory was upload successfull",
        data: newMonotory,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async getMonitories(req: Request, res: Response) {
    try {
      const params: IParamsGetMonitory = req.query;
      const keyword: string = params.q ? params.q : "";
      const page: number = params.page ? parseInt(params.page) - 1 : 0;
      const limit: number = params.limit ? parseInt(params.limit) : 20;
      const skip: number = page * limit;
      const sort: {} = createSort(params.sort);
      // Queries
      const getMonitoryQuery = Monitory.find({
        location: { $regex: keyword, $options: "i" },
      })
        .sort(sort)
        .skip(skip)
        .limit(limit);
      const getTotalQuery = Monitory.countDocuments({
        name: { $regex: keyword, $options: "i" },
      });
      // Get Data
      const monitories = await getMonitoryQuery.exec();
      const total = await getTotalQuery.exec();
      const data: IPagination = createPagination(monitories, total, 20, params);
      return res.status(200).send(data);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getMonitoryById(req: Request, res: Response) {
    try {
      const _id = req.params._id;
      const monitories = await isMonitotyExist(_id);
      if (!monitories)
        return res.status(404).send({
          message: "Not Found",
        });
      return res.status(200).send({
        data: monitories,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async patchMonitoryById(req: Request, res: Response) {
    try {
      const _id = req.params._id;
      const data = req.body;
      const monitories = await isMonitotyExist(_id);
      if (!monitories)
        return res.status(404).send({
          message: "Not Found",
        });
      const { date, location, traps, result, note } = monitories;
      const update = Object.assign(
        { date, location, traps, result, note },
        data
      );
      // Update
      await Monitory.findByIdAndUpdate(_id, update);
      return res.status(200).send({
        message: "Update was successfull",
        data: update,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async deletedMonitoryById(req: Request, res: Response) {
    try {
      const _id = req.params._id;
      const monitories = await isMonitotyExist(_id);
      if (!monitories)
        return res.status(404).send({
          message: "Not Found",
        });

      await Monitory.findByIdAndUpdate(_id);
      return res.status(200).send({
        message: "Monitory deleted was successfull",
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new MonitoringController();
