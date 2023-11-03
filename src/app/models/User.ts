import Joi from "joi";
import passwordComple from "joi-password-complexity";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Role } from "../../interfaces/Enum";
import { IUser } from "../../interfaces/IUser";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

// Menthods
userSchema.methods.generateToken = function (this: IUser): string {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.TOKEN_SERECT_KEY,
    {
      expiresIn: "2h",
    }
  );
  return token;
};

userSchema.methods.generateRefreshToken = function (this: IUser): string {
  const refreshToken = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.REFRESH_SERECT_KEY,
    {
      expiresIn: "7d",
    }
  );
  return refreshToken;
};

const validate = (user: IUser) => {
  const Schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: passwordComple().required(),
    role: Joi.valid(...Object.values(Role)).required(),
  });

  return Schema.validate(user);
};

// Create Model
const User = mongoose.model("User", userSchema);

// Export
export { User, validate };
