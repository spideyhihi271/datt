"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Monitoring_1 = require("../models/Monitoring");
const createSort_1 = __importDefault(require("../../utils/createSort"));
const createPagination_1 = __importDefault(require("../../utils/createPagination"));
const mongoose_1 = __importDefault(require("mongoose"));
const isMonitotyExist = async (_id) => {
    // Valid date
    if (!mongoose_1.default.Types.ObjectId.isValid(_id))
        return undefined;
    const monitory = await Monitoring_1.Monitory.findById(_id);
    if (!monitory)
        return undefined;
    return monitory;
};
class MonitoringController {
    async saveFromFile(data, req, res) {
        try {
            data.forEach(async (monitory) => {
                const data = {
                    date: monitory["Ngày tháng"],
                    location: monitory["Địa điểm"],
                    traps: monitory["Số bẫy x số đếm"],
                    result: monitory["Số chuột bẫy được"],
                    note: monitory["Ghi chú"] ? monitory["Ghi chú"] : "",
                };
                // Validate
                const { error } = (0, Monitoring_1.validate)(data);
                if (error)
                    return res.status(400).send({ message: error.details[0].message });
                await new Monitoring_1.Monitory(data).save();
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async postNewMonitories(req, res) {
        try {
            const data = req.body;
            const { error } = (0, Monitoring_1.validate)(data);
            if (error)
                return res.status(400).send({ message: error.details[0].message });
            const newMonotory = await new Monitoring_1.Monitory(data).save();
            return res.status(200).send({
                message: "New Monotory was upload successfull",
                data: newMonotory,
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getMonitories(req, res) {
        try {
            const params = req.query;
            const keyword = params.q ? params.q : "";
            const page = params.page ? parseInt(params.page) - 1 : 0;
            const limit = params.limit ? parseInt(params.limit) : 20;
            const skip = page * limit;
            const sort = (0, createSort_1.default)(params.sort);
            // Queries
            const getMonitoryQuery = Monitoring_1.Monitory.find({
                location: { $regex: keyword, $options: "i" },
            })
                .sort(sort)
                .skip(skip)
                .limit(limit);
            const getTotalQuery = Monitoring_1.Monitory.countDocuments({
                name: { $regex: keyword, $options: "i" },
            });
            // Get Data
            const monitories = await getMonitoryQuery.exec();
            const total = await getTotalQuery.exec();
            const data = (0, createPagination_1.default)(monitories, total, 20, params);
            return res.status(200).send(data);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getMonitoryById(req, res) {
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
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async patchMonitoryById(req, res) {
        try {
            const _id = req.params._id;
            const data = req.body;
            const monitories = await isMonitotyExist(_id);
            if (!monitories)
                return res.status(404).send({
                    message: "Not Found",
                });
            const { date, location, traps, result, note } = monitories;
            const update = Object.assign({ date, location, traps, result, note }, data);
            // Update
            await Monitoring_1.Monitory.findByIdAndUpdate(_id, update);
            return res.status(200).send({
                message: "Update was successfull",
                data: update,
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async deletedMonitoryById(req, res) {
        try {
            const _id = req.params._id;
            const monitories = await isMonitotyExist(_id);
            if (!monitories)
                return res.status(404).send({
                    message: "Not Found",
                });
            await Monitoring_1.Monitory.findByIdAndUpdate(_id);
            return res.status(200).send({
                message: "Monitory deleted was successfull",
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.default = new MonitoringController();
//# sourceMappingURL=MonitoringController.js.map