"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Equip_1 = require("../models/Equip");
const createSort_1 = __importDefault(require("../../utils/createSort"));
const createPagination_1 = __importDefault(require("../../utils/createPagination"));
const isEquipExist = async (_id) => {
    // Validate
    if (!mongoose_1.default.Types.ObjectId.isValid(_id))
        return undefined;
    // Get
    const equid = await Equip_1.Equid.findById(_id).exec();
    if (!equid)
        return undefined;
    return equid;
};
class EquipController {
    async saveFromFile(data, req, res) {
        try {
            data.forEach(async (equid) => {
                // Tranform
                const newEquip = {
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
                const { error } = (0, Equip_1.validate)(newEquip);
                if (error)
                    return res.status(403).send({ message: error.details[0].message });
                // Save
                await new Equip_1.Equid(newEquip).save();
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async postNewEquid(req, res) {
        try {
            const data = req.body;
            const { error } = (0, Equip_1.validate)(data);
            if (error)
                return res.status(400).send({ message: error.details[0].message });
            // Saving
            const equip = await new Equip_1.Equid(data).save();
            return res.status(200).send({
                message: "Add Equid was successfull",
                data: equip,
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getEquips(req, res) {
        try {
            const params = req.query;
            const keyword = params.q ? params.q : "";
            const sort = (0, createSort_1.default)(params.sort);
            const page = (parseInt(params.page) - 1) | 0;
            const limit = params.limit ? parseInt(params.limit) : 20;
            const skip = page * limit;
            const getEquip = Equip_1.Equid.find({
                name: { $regex: keyword, $options: "i" },
            })
                .sort(sort)
                .skip(skip)
                .limit(limit);
            const getTotal = Equip_1.Equid.countDocuments({
                name: { $regex: keyword, $options: "i" },
            });
            const equids = await getEquip.exec();
            const total = await getTotal.exec();
            const data = (0, createPagination_1.default)(equids, total, 20, params);
            return res.status(200).send(data);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getEquipByID(req, res) {
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
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async patchEquipByID(req, res) {
        try {
            const _id = req.params._id;
            const data = req.body;
            const target = await isEquipExist(_id);
            if (!target)
                return res.status(404).send({
                    message: "Not Found",
                });
            // Update
            const { code, name, quantity, origin, manufactureYear, note, ...others } = target;
            const update = Object.assign({ code, name, quantity, origin, manufactureYear, note }, data);
            const { error } = (0, Equip_1.validate)(update);
            if (error)
                return res.status(400).send({ message: error.details[0].message });
            await Equip_1.Equid.findByIdAndUpdate(_id, update);
            return res.status(200).send({
                message: "Update was successfull",
                data: update,
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async deletedEquipByID(req, res) {
        try {
            const _id = req.params._id;
            const target = await isEquipExist(_id);
            if (!target)
                return res.status(404).send({
                    message: "Not Found",
                });
            await Equip_1.Equid.findByIdAndRemove(_id);
            return res.status(200).send({
                message: "Equip was deleted",
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.default = new EquipController();
//# sourceMappingURL=EquipController.js.map