import { Request, Response } from "express";
import { IDataTrainingXlsx } from "../../interfaces/IDataExcel";
import { ITraining } from "../../interfaces/ITraining";
import { Training, validate } from "../models/Training";

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
  async postNewTraining(req: Request, res: Response) {}
  async getTraining(req: Request, res: Response) {}
  async getTrainingById(req: Request, res: Response) {}
  async patchTrainingById(req: Request, res: Response) {}
  async deletedTrainingById(req: Request, res: Response) {}
}

export default new TrainingController();
