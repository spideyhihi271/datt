import mongoose from "mongoose";
import { Request, Response } from "express";
import { IDataEquipXlsx } from "../../interfaces/IDataExcel";
import { IEquid } from "../../interfaces/IEquip";
import { Equid, validate } from "../models/Equip";
import { IParamsGetEquid } from "interfaces/IParam";
import createSort from "../../utils/createSort";
import createPagination from "../../utils/createPagination";

const isEquipExist = async (_id: string) => {
  // Validate
  if (!mongoose.Types.ObjectId.isValid(_id)) return undefined;
  // Get
  const equid = await Equid.findById(_id).exec();
  if (!equid) return undefined;
  return equid;
};
class EquipController {
  async saveFromFile(data: IDataEquipXlsx[], req: Request, res: Response) {
    try {
      data.forEach(async (equid: IDataEquipXlsx) => {
        // Tranform
        const newEquip: IEquid = {
          code: equid["Mã số"],
          name: equid["Tên Thiết bị"],
          quantity: equid["Số lượng"] ? equid["Số lượng"] : 1,
          origin: equid["Xuất xứ"] ? equid["Xuất xứ"] : " ",
          manufactureYear: equid["Năm sản xuất"]
            ? equid["Năm sản xuất"].toString()
            : " ",
          note: equid["Ghi chú"] ? equid["Ghi chú"] : "",
        };
        // Validate
        const { error } = validate(newEquip);
        if (error)
          return res.status(403).send({ message: error.details[0].message });
        // Save
        await new Equid(newEquip).save();
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async postNewEquid(req: Request, res: Response) {
    try {
      const data: IEquid = req.body;
      const { error } = validate(data);
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      // Saving
      const equip = await new Equid(data).save();
      return res.status(200).send({
        message: "Add Equid was successfull",
        data: equip,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async getEquips(req: Request, res: Response) {
    try {
      const params: IParamsGetEquid = req.query;
      const keyword: string = params.q ? params.q : "";
      const sort: {} = createSort(params.sort);
      const page: number = (parseInt(params.page) - 1) | 0;
      const limit: number = params.limit ? parseInt(params.limit) : 20;
      const skip: number = page * limit;

      const getEquip = Equid.find({
        name: { $regex: keyword, $options: "i" },
      })
        .sort(sort)
        .skip(skip)
        .limit(limit);
      const getTotal = Equid.countDocuments({
        name: { $regex: keyword, $options: "i" },
      });
      const equids = await getEquip.exec();
      const total = await getTotal.exec();
      const data = createPagination(equids, total, 20, params);
      return res.status(200).send(data);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getEquipByID(req: Request, res: Response) {
    try {
      const _id = req.params._id;
      const equid = await isEquipExist(_id);
      if (!equid)
        return res.status(404).send({
          message: "Not Found",
        });
      return res.status(200).send({
        data: equid,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async patchEquipByID(req: Request, res: Response) {
    try {
      const _id = req.params._id;
      const data = req.body;
      const target = await isEquipExist(_id);
      if (!target)
        return res.status(404).send({
          message: "Not Found",
        });
      // Update
      const { code, name, quantity, origin, manufactureYear, note, ...others } =
        target;
      const update = Object.assign(
        { code, name, quantity, origin, manufactureYear, note },
        data
      );
      const { error } = validate(update);
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      await Equid.findByIdAndUpdate(_id, update);
      return res.status(200).send({
        message: "Update was successfull",
        data: update,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async deletedEquipByID(req: Request, res: Response) {
    try {
      const _id = req.params._id;
      const target = await isEquipExist(_id);
      if (!target)
        return res.status(404).send({
          message: "Not Found",
        });
      await Equid.findByIdAndRemove(_id);
      return res.status(200).send({
        message: "Equip was deleted",
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new EquipController();
