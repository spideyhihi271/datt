"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Employee_1 = require("../models/Employee");
const Enum_1 = require("../../interfaces/Enum");
const createPagination_1 = __importDefault(require("../../utils/createPagination"));
const createSort_1 = __importDefault(require("../../utils/createSort"));
const isEmployeeExist = async (_id) => {
    // Valid date
    if (!mongoose_1.default.Types.ObjectId.isValid(_id))
        return undefined;
    const employee = await Employee_1.Employee.findById(_id);
    if (!employee)
        return undefined;
    return employee;
};
class EmployeeController {
    async saveFromFile(data, req, res) {
        try {
            data.forEach(async (employee) => {
                // Tranform data
                const dataInput = {
                    name: employee["Họ và tên"],
                    birth: employee["Năm sinh"],
                    gender: employee["Giới tính"].includes("Nam")
                        ? Enum_1.Gender.Male
                        : Enum_1.Gender.Female,
                    address: employee["Địa chỉ"],
                    phone: "0" + employee["Số điện thoại"],
                };
                // Validate
                const { error } = (0, Employee_1.validate)(dataInput);
                if (error)
                    return res.status(403).send({ message: error.details[0].message });
                // Save
                await new Employee_1.Employee(dataInput).save();
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async postNewEmployee(req, res) {
        try {
            const data = req.body;
            // Validate
            const { error } = (0, Employee_1.validate)(data);
            if (error)
                return res.status(400).send({ message: error.details[0].message });
            // Saving
            await new Employee_1.Employee(data).save();
            return res.status(200).send({
                message: "New Employee was saved",
                data,
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getEmployee(req, res) {
        try {
            const params = req.query;
            const keyword = params.q ? params.q : "";
            const page = params.page ? parseInt(params.page) - 1 : 0;
            const limit = params.limit ? parseInt(params.limit) : 20;
            const skip = page * limit;
            const sort = (0, createSort_1.default)(params.sort);
            // Query
            const employeeQuery = Employee_1.Employee.find({
                name: { $regex: keyword, $options: "i" },
            })
                .sort(sort)
                .skip(skip)
                .limit(limit);
            const paginationQuery = Employee_1.Employee.countDocuments({
                name: { $regex: keyword, $options: "i" },
            });
            // Get data
            const employees = await employeeQuery.exec();
            const total = await paginationQuery.exec();
            const data = (0, createPagination_1.default)(employees, total, 20, params);
            return res.status(200).send(data);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getEmployeeByID(req, res) {
        try {
            const _id = req.params._id;
            const employee = await isEmployeeExist(_id);
            if (!employee)
                return res.status(404).send({
                    message: "Not Found",
                });
            return res.status(200).send({
                data: employee,
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async patchEmployeeByID(req, res) {
        const _id = req.params._id;
        const data = req.body;
        const target = await isEmployeeExist(_id);
        // Not Found
        if (!target)
            return res.status(404).send({
                message: "Not found",
            });
        // Validate
        const { name, birth, address, gender, phone, ...orther } = target;
        const update = Object.assign({ name, birth, address, gender, phone }, data);
        const { error } = (0, Employee_1.validate)(update);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        // Update
        const response = await Employee_1.Employee.findByIdAndUpdate(_id, update);
        return res.status(200).send({
            message: "Employee was updated!",
            data: update,
        });
    }
    async deletedEmployeeByID(req, res) {
        const _id = req.params._id;
        const employee = await isEmployeeExist(_id);
        // Not Found
        if (!employee)
            return res.status(404).send({
                message: "Not found",
            });
        // Deleted
        await Employee_1.Employee.findByIdAndDelete(_id);
        return res.status(200).send({
            message: "Employee was deleted",
        });
    }
}
exports.default = new EmployeeController();
//# sourceMappingURL=EmployeeController.js.map