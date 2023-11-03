import mongoose from "mongoose";
import { Request, Response } from "express";
import { Employee, validate } from "../models/Employee";
import { IDataEmployeeXlsx } from "../../interfaces/IDataExcel";
import { IEmployee } from "../../interfaces/IEmployee";
import { Gender } from "../../interfaces/Enum";
import { IPagination } from "../../interfaces/IPagination";
import createPagination from "../../utils/createPagination";
import createSort from "../../utils/createSort";

const isEmployeeExist = async (_id: string) => {
  // Valid date
  if (!mongoose.Types.ObjectId.isValid(_id)) return undefined;
  const employee = await Employee.findById(_id);
  if (!employee) return undefined;
  return employee;
};
class EmployeeController {
  async saveFromFile(data: IDataEmployeeXlsx[], req: Request, res: Response) {
    try {
      data.forEach(async (employee: IDataEmployeeXlsx) => {
        // Tranform data
        const dataInput: IEmployee = {
          name: employee["Họ và tên"],
          birth: employee["Năm sinh"],
          gender: employee["Giới tính"].includes("Nam")
            ? Gender.Male
            : Gender.Female,
          address: employee["Địa chỉ"],
          phone: "0" + employee["Số điện thoại"],
        };
        // Validate
        const { error } = validate(dataInput);
        if (error)
          return res.status(403).send({ message: error.details[0].message });
        // Save
        await new Employee(dataInput).save();
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async postNewEmployee(req: Request, res: Response) {
    try {
      const data: IEmployee = req.body;
      // Validate
      const { error } = validate(data);
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      // Saving
      await new Employee(data).save();
      return res.status(200).send({
        message: "New Employee was saved",
        data,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async getEmployee(req: Request, res: Response) {
    try {
      const params: any = req.query;
      const keyword: string = params.q ? params.q : "";
      const page: number = params.page ? parseInt(params.page) - 1 : 0;
      const limit: number = params.limit ? parseInt(params.limit) : 20;
      const skip: number = page * limit;
      const sort: {} = createSort(params.sort);
      // Query
      const employeeQuery = Employee.find({
        name: { $regex: keyword, $options: "i" },
      })
        .sort(sort)
        .skip(skip)
        .limit(limit);
      const paginationQuery = Employee.countDocuments({
        name: { $regex: keyword, $options: "i" },
      });
      // Get data
      const employees = await employeeQuery.exec();
      const total = await paginationQuery.exec();
      const data: IPagination = createPagination(employees, total, 20, params);
      return res.status(200).send(data);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getEmployeeByID(req: Request, res: Response) {
    try {
      const _id: string = req.params._id;
      const employee = await isEmployeeExist(_id);
      if (!employee)
        return res.status(404).send({
          message: "Not Found",
        });
      return res.status(200).send({
        data: employee,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async patchEmployeeByID(req: Request, res: Response) {
    const _id: string = req.params._id;
    const data: any = req.body;
    const target = await isEmployeeExist(_id);
    // Not Found
    if (!target)
      return res.status(404).send({
        message: "Not found",
      });
    // Validate
    const { name, birth, address, gender, phone, ...orther } = target;
    const update: IEmployee = Object.assign(
      { name, birth, address, gender, phone },
      data
    );
    const { error } = validate(update);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    // Update
    const response = await Employee.findByIdAndUpdate(_id, update);
    return res.status(200).send({
      message: "Employee was updated!",
      data: update,
    });
  }
  async deletedEmployeeByID(req: Request, res: Response) {
    const _id: string = req.params._id;
    const employee = await isEmployeeExist(_id);
    // Not Found
    if (!employee)
      return res.status(404).send({
        message: "Not found",
      });
    // Deleted
    await Employee.findByIdAndDelete(_id);
    return res.status(200).send({
      message: "Employee was deleted",
    });
  }
}

export default new EmployeeController();
