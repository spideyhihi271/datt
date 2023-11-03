import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../interfaces/Enum";
import { IRequestWithUser } from "../interfaces/IRequest";
import { IUser } from "../interfaces/IUser";

class AuthMiddleWare {
  authenticated(req: IRequestWithUser, res: Response, next: NextFunction) {
    let token: string = req.headers.authorization;
    if (!token)
      return res.status(403).send({
        message: "You are not authenticated",
      });

    token = token.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SERECT_KEY, (err, data: IUser) => {
      if (err)
        return res.status(403).send({
          message: "Your token is not valid",
        });
      req.user = data;
      next();
    });
  }
  isCensorOrManager(req: IRequestWithUser, res: Response, next: NextFunction) {
    const rolesCanApprove: string[] = [Role.Censor, Role.Manager];
    const canApprove: boolean = rolesCanApprove.find(
      (role) => role === req.user.role
    )
      ? true
      : false;
    if (!canApprove)
      return res.status(403).send({
        message: "Access Denied for this action.",
      });
    next();
  }
  isManager(req: IRequestWithUser, res: Response, next: NextFunction) {
    const isManager = req.user.role === Role.Manager ? true : false;
    if (!isManager)
      return res.status(403).send({
        message: "Access denied for this action",
      });
    next();
  }
}

export default new AuthMiddleWare();
