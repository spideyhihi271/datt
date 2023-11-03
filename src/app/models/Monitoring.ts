import Joi from "joi";
import mongoose from "mongoose";
import { IMonitory } from "../../interfaces/IMonitory";

const monitorySchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    location: { type: String, required: true },
    traps: { type: Number, required: true, default: 0 },
    result: { type: Number, require: true, default: 0 },
    note: { type: String, require: true },
  },
  { timestamps: true }
);

const validate = (monitory: IMonitory) => {
  const Schema = Joi.object({
    date: Joi.string().required(),
    location: Joi.string().required(),
    traps: Joi.number().required(),
    result: Joi.number().min(0),
    note: Joi.allow(),
  });
  return Schema.validate(monitory);
};

// Create Model
const Monitory = mongoose.model("Monitory", monitorySchema);

// Export
export { Monitory, validate };

