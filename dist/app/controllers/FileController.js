"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const xlsx_1 = __importDefault(require("xlsx"));
const Enum_1 = require("../../interfaces/Enum");
const File_1 = require("../models/File");
const firebase_1 = __importDefault(require("../../services/firebase"));
const createPagination_1 = __importDefault(require("../../utils/createPagination"));
const createSort_1 = __importDefault(require("../../utils/createSort"));
const EmployeeController_1 = __importDefault(require("./EmployeeController"));
const EquipController_1 = __importDefault(require("./EquipController"));
const MonitoringController_1 = __importDefault(require("./MonitoringController"));
const TraningController_1 = __importDefault(require("./TraningController"));
const isFileExist = async (_id) => {
    // Validate
    if (!mongoose_1.default.Types.ObjectId.isValid(_id))
        return undefined;
    // Get
    const file = await File_1.File.findById(_id).exec();
    if (!file)
        return undefined;
    return file;
};
class FileController {
    async postNewFile(req, res) {
        try {
            if (!req.file)
                return res.status(403).send({
                    message: "No file",
                });
            const file = await firebase_1.default.uploadFile(req, res);
            const data = {
                name: file.name,
                owner: req.user._id,
                type: req.body.type,
                url: file.downloadURL,
            };
            const { error } = (0, File_1.validate)(data);
            if (error)
                return res.status(400).send({ message: error.details[0].message });
            const newFile = await new File_1.File(data).save();
            return res
                .status(200)
                .send({ message: "Your file was upload successfull", data: newFile });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getAllFile(req, res) {
        try {
            const params = req.query;
            const keyword = params.q ? params.q : "";
            const typeFiles = params.type
                ? params.type.split(",")
                : Object.values(Enum_1.TypeFile);
            const status = params.status
                ? params.status.split(",")
                : Object.values(Enum_1.StatusFile);
            const sort = (0, createSort_1.default)(params.sort);
            const page = (parseInt(params.page) - 1) | 0;
            const limit = params.limit ? parseInt(params.limit) : 20;
            const skip = page * limit;
            const filter = [
                {
                    name: { $regex: keyword, $options: "i" },
                },
                {
                    type: { $in: typeFiles },
                },
                {
                    status: { $in: status },
                },
                {
                    deleted: false,
                },
            ];
            // If Staff you only can see your file;
            if (req.user.role === Enum_1.Role.Staff)
                filter.push({
                    owner: req.user._id,
                });
            // Queries
            const getFilesQuery = File_1.File.find({
                $and: filter,
            })
                .sort(sort)
                .skip(skip)
                .limit(limit);
            const paginationQuery = File_1.File.countDocuments({
                $and: filter,
            });
            // Data
            const files = await getFilesQuery.exec();
            const total = await paginationQuery.exec();
            const data = (0, createPagination_1.default)(files, total, 20, params);
            return res.status(200).send({ data });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getFileByID(req, res) {
        try {
            const _id = req.params._id;
            const file = await isFileExist(_id);
            if (!file)
                return res.status(404).send({
                    message: "Not Found",
                });
            // IF you are staff you can't watch another file
            if (req.user.role === Enum_1.Role.Staff) {
                if (file._id != req.user._id)
                    return res.status(403).send({
                        message: "Access denied for this action",
                    });
            }
            return res.status(200).send({
                data: file,
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async saveOnDB(req, res) {
        try {
            const _id = req.params._id;
            const file = await isFileExist(_id);
            if (!file)
                return res.status(404).send({
                    message: "Not Found",
                });
            else {
                // GET Data
                let fileXlsx = await axios_1.default.get(file.url, {
                    responseType: "arraybuffer",
                });
                // ReadFile
                const workbook = xlsx_1.default.read(fileXlsx.data, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const data = xlsx_1.default.utils.sheet_to_json(worksheet);
                // SAVE
                switch (file.type) {
                    case Enum_1.TypeFile.HR:
                        await EmployeeController_1.default.saveFromFile(data, req, res);
                        break;
                    case Enum_1.TypeFile.Equipment:
                        await EquipController_1.default.saveFromFile(data, req, res);
                    case Enum_1.TypeFile.Monitory:
                        await MonitoringController_1.default.saveFromFile(data, req, res);
                    case Enum_1.TypeFile.Training:
                        await TraningController_1.default.saveFromFile(data, req, res);
                    default:
                        break;
                }
                // Return
                return res.status(200).send({
                    message: "Save on DB was successfull",
                });
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.default = new FileController();
//# sourceMappingURL=FileController.js.map