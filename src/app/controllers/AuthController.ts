import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { IUser, IUserLogin } from "interfaces/IUser";
import { User } from "../models/User";

let refreshStores: string[] = [];

class AuthController {
  async signIn(req: Request, res: Response) {
    try {
      const data: IUserLogin = req.body;

      const user: any = await User.findOne({ email: data.email });
      if (!user)
        return res.status(404).send({
          message: "Your account was not found",
        });

      const isValidPassword = await bcrypt.compare(
        data.password,
        user.password
      );

      if (!isValidPassword)
        return res.status(403).send({
          message: "Wrong email or password",
        });

      const token = user.generateToken();
      const refresh = user.generateRefreshToken();

      // Save Refresh token in cookies
      res.cookie("refreshToken", refresh, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      // Save Refresh on Store
      refreshStores.push(refresh);
      const { password, ...others } = user._doc;
      return res.status(200).send({
        data: {
          ...others,
          token,
        },
        message: "Login successful",
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async refreshToken(req: Request, res: Response) {
    try {
      const refresh = req.cookies.refreshToken;

      if (!refresh)
        return res.status(403).send({
          message: "You are not authenticated",
        });

      const isValid = refreshStores.includes(refresh) ? true : false;
      if (!isValid)
        return res.status(403).send({
          message: "Your refresh token is not valid",
        });

      jwt.verify(
        refresh,
        process.env.REFRESH_SERECT_KEY,
        (error: any, data: IUser) => {
          if (error) throw new Error(error);
          else {
            refreshStores = refreshStores.filter((token) => token != refresh);
            const createReturnData = async () => {
              const user: any = await User.findById(data._id);
              const token = user.generateToken();
              const refresh = user.generateRefreshToken();

              // Update in cookies
              res.cookie("refreshToken", refresh, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
              });
              // Save on refresh store
              refreshStores.push(refresh);
              return res.status(200).send({
                message: "Refresh token successfull",
                token,
              });
            };
            createReturnData();
          }
        }
      );
    } catch (error) {
      throw new Error(error);
    }
  }
  async logout(req: Request, res: Response) {
    try {
      const refresh = req.cookies.refreshToken;
      refreshStores = refreshStores.filter((token) => token !== refresh);
      res.clearCookie("refreshToken");
      return res.status(200).send({
        message: "Logout successfull",
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new AuthController();
