"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const isUserExist = async (_id) => {
    // Valid date
    if (!mongoose_1.default.Types.ObjectId.isValid(_id))
        return undefined;
    const user = await User_1.User.findById(_id);
    if (!user)
        return undefined;
    return user;
};
class UserController {
    async createNewUser(req, res) {
        try {
            const data = req.body;
            // Validate
            const { error } = (0, User_1.validate)(data);
            if (error)
                return res.status(400).send({ message: error.details[0].message });
            // Check mail
            const isExist = await User_1.User.findOne({ email: data.email });
            if (isExist)
                return res.status(400).send({ message: "Email was exist" });
            // Create pass
            const salt = await bcryptjs_1.default.genSalt(10);
            const passwordHash = await bcryptjs_1.default.hash(data.password, salt);
            const newUser = {
                ...data,
                password: passwordHash,
            };
            const response = await new User_1.User(newUser).save();
            return res.status(200).send({ data });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async deletedUserById(req, res) {
        const _id = req.params._id;
        const target = await isUserExist(_id);
        // Not Found
        if (!target)
            return res.status(404).send({
                message: "Not found",
            });
        const response = await User_1.User.findByIdAndDelete(_id);
        return res.status(200).send({
            message: "Data was deleted",
        });
    }
    async updatePassword(req, res) {
        const _id = req.params._id;
        const data = req.body;
        const user = await isUserExist(_id);
        if (!user)
            return res.status(404).send({ message: "Not found" });
        // Check pass
        const isValidPassword = await bcryptjs_1.default.compare(data.oldpass, user.password);
        if (!isValidPassword)
            return res.status(403).send({
                message: "Wrong email or password",
            });
        // New Pass
        const salt = await bcryptjs_1.default.genSalt(10);
        const newPassHash = await bcryptjs_1.default.hash(data.newpass, salt);
        // Update
        const update = { ...user, password: newPassHash };
        const response = await User_1.User.findByIdAndUpdate(_id, update);
        return res.status(200).send({
            message: "Update password is successfull",
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=UserController.js.map