import Joi from "joi";
import mongoose from "mongoose";
import { ITraining } from "../../interfaces/ITraining";

const trainingSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    content: { type: String, required: true },
    organizingUnit: { type: String, required: true },
    trainer: { type: String, required: true },
  },
  { timestamps: true }
);

const validate = (training: ITraining) => {
  const Schema = Joi.object({
    date: Joi.string().required(),
    content: Joi.string().required(),
    organizingUnit: Joi.string().required(),
    trainer: Joi.string().required(),
  });
  return Schema.validate(training);
};

// Create Model
const Training = mongoose.model("Training", trainingSchema);

// Export
export { Training, validate };
