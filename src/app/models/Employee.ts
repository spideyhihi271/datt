import Joi from "joi";
import mongoose from "mongoose";
import { Gender } from "../../interfaces/Enum";
import { IEmployee } from "../../interfaces/IEmployee";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birth: { type: Number, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

const validate = (employee: IEmployee) => {
  const Schema = Joi.object({
    name: Joi.string().required(),
    birth: Joi.number().min(1000).max(9999).required(),
    gender: Joi.valid(...Object.values(Gender)).required(),
    address: Joi.string().required(),
    phone: Joi.string()
      .regex(/^\d{10}$/)
      .required(),
  });
  return Schema.validate(employee);
};

// Create Model
const Employee = mongoose.model("Employee", employeeSchema);

// Export
export { Employee, validate };
