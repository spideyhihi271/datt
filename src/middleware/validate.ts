import { NextFunction, Request, Response } from "express";
import { IUserLogin } from "interfaces/IUser";
import Joi from "joi";

class ValidateMiddleWare {
  signIn(req: Request, res: Response, next: NextFunction) {
    const data: IUserLogin = req.body;
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error } = schema.validate(data);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    else next();
  }
}

export default new ValidateMiddleWare();
