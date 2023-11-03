import { Request } from "express";
import { IUserJWT } from "./IUser";

export interface IRequestWithUser extends Request {
  user: IUserJWT;
}
