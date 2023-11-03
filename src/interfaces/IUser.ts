import { Schema } from "mongoose";
import { Role } from "./Enum";

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserSignIn extends IUserLogin {
  name: string;
  fullName: string;
  role: Role;
}

export interface IUser {
  _id: Schema.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  fullName: string;
  role: Role;
}

export interface IUserJWT {
  _id: Schema.Types.ObjectId;
  email: string;
  role: Role;
}
