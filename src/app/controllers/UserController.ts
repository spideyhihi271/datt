import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, validate } from "../models/User";
import { IUser, IUserChangePass } from "../../interfaces/IUser";
import mongoose from "mongoose";

const isUserExist = async (_id: string) => {
  // Valid date
  if (!mongoose.Types.ObjectId.isValid(_id)) return undefined;
  const user = await User.findById(_id);
  if (!user) return undefined;
  return user;
};
class UserController {
  async createNewUser(req: Request, res: Response) {
    try {
      const data: IUser = req.body;
      // Validate
      const { error } = validate(data);
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      // Check mail
      const isExist = await User.findOne({ email: data.email });
      if (isExist) return res.status(400).send({ message: "Email was exist" });
      // Create pass
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(data.password, salt);
      const newUser: IUser = {
        ...data,
        password: passwordHash,
      };
      const response = await new User(newUser);
      return res.status(200).send({ data });
    } catch (error) {
      throw new Error(error);
    }
  }
  async deletedUserById(req: Request, res: Response) {
    const _id = req.params._id;
    const target = await isUserExist(_id);
    // Not Found
    if (!target)
      return res.status(404).send({
        message: "Not found",
      });
    const response = await User.findByIdAndDelete(_id);
    return res.status(200).send({
      message: "Data was deleted",
    });
  }
  async updatePassword(req: Request, res: Response) {
    const _id = req.params._id;
    const data: IUserChangePass = req.body;
    const user = await isUserExist(_id);
    if (!user) return res.status(404).send({ message: "Not found" });
    // Check pass
    const isValidPassword = await bcrypt.compare(data.oldpass, user.password);
    if (!isValidPassword)
      return res.status(403).send({
        message: "Wrong email or password",
      });
    // New Pass
    const salt = await bcrypt.genSalt(10);
    const newPassHash = await bcrypt.hash(data.newpass, salt);
    // Update
    const update: IUser = { ...user, password: newPassHash };
    const response = await User.findByIdAndUpdate(_id, update);
    return res.status(200).send({
      message: "Update password is successfull",
    });
  }
}

export default new UserController();
