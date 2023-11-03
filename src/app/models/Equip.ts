import Joi, { number, string } from "joi";
import mongoose from "mongoose";
import { IEquid } from "../../interfaces/IEquip";

const equipSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    origin: { type: String, required: true, default: " " },
    manufactureYear: {
      type: String,
      required: true,
      default: " ",
    },
    note: { type: String, default: " " },
  },
  { timestamps: true }
);

const validate = (equid: IEquid) => {
  const Schema = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    origin: Joi.allow(),
    manufactureYear: Joi.allow(),
    note: Joi.allow(),
  });
  return Schema.validate(equid);
};

// Create Model
const Equid = mongoose.model("Equid", equipSchema);

// Export
export { Equid, validate };
