"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Training_1 = require("../models/Training");
const mongoose_1 = __importDefault(require("mongoose"));
const createSort_1 = __importDefault(require("../../utils/createSort"));
const createPagination_1 = __importDefault(require("../../utils/createPagination"));
const isExist = async (_id) => {
    // Validate
    if (!mongoose_1.default.Types.ObjectId.isValid(_id))
        return undefined;
    // Get
    const trainning = await Training_1.Training.findById(_id).exec();
    if (!trainning)
        return undefined;
    return trainning;
};
class TrainingController {
    async saveFromFile(data, req, res) {
        try {
            data.forEach(async (trainning) => {
                const data = {
                    date: trainning["Ngày, Tháng, Năm"],
                    content: trainning["Nội dung tập huấn/ đào tạo"],
                    organizingUnit: trainning["Đơn vị tổ chức"],
                    trainer: trainning["Giảng viên tập huấn/đào tạo"],
                };
                // Validate
                const { error } = (0, Training_1.validate)(data);
                if (error)
                    return res.status(403).send({ message: error.details[0].message });
                // Save
                await new Training_1.Training(data).save();
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async postNewTraining(req, res) {
        try {
            const data = req.body;
            // Validate
            const { error } = (0, Training_1.validate)(data);
            if (error)
                return res.status(400).send({ message: error.details[0].message });
            // Saving
            await new Training_1.Training(data).save();
            return res.status(200).send({
                message: "New Traning was saved",
                data,
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getTraining(req, res) {
        try {
            const params = req.query;
            const keyword = params.q ? params.q : "";
            const page = params.page ? parseInt(params.page) - 1 : 0;
            const limit = params.limit ? parseInt(params.limit) : 20;
            const skip = page * limit;
            const sort = (0, createSort_1.default)(params.sort);
            // Query
            const trainingQuery = Training_1.Training.find({
                content: { $regex: keyword, $options: "i" },
            })
                .sort(sort)
                .skip(skip)
                .limit(limit);
            const paginationQuery = Training_1.Training.countDocuments({
                content: { $regex: keyword, $options: "i" },
            });
            // Get data
            const trainning = await trainingQuery.exec();
            const total = await paginationQuery.exec();
            const data = (0, createPagination_1.default)(trainning, total, 20, params);
            return res.status(200).send(data);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getTrainingById(req, res) {
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
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async patchTrainingById(req, res) {
        const _id = req.params._id;
        const data = req.body;
        const target = await isExist(_id);
        // Not Found
        if (!target)
            return res.status(404).send({
                message: "Not found",
            });
        // Validate
        const { date, content, organizingUnit, trainer, ...orther } = target;
        const update = Object.assign({ date, content, organizingUnit, trainer }, data);
        const { error } = (0, Training_1.validate)(update);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        // Update
        const response = await Training_1.Training.findByIdAndUpdate(_id, update);
        return res.status(200).send({
            message: "Training was updated!",
            data: update,
        });
    }
    async deletedTrainingById(req, res) {
        try {
            const _id = req.params._id;
            const training = await isExist(_id);
            // Not Found
            if (!training)
                return res.status(404).send({
                    message: "Not found",
                });
            // Deleted
            await Training_1.Training.findByIdAndDelete(_id);
            return res.status(200).send({
                message: "Traning was deleted",
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.default = new TrainingController();
//# sourceMappingURL=TraningController.js.map