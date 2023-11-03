"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Training_1 = require("../models/Training");
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
    async postNewTraining(req, res) { }
    async getTraining(req, res) { }
    async getTrainingById(req, res) { }
    async patchTrainingById(req, res) { }
    async deletedTrainingById(req, res) { }
}
exports.default = new TrainingController();
//# sourceMappingURL=TraningController.js.map