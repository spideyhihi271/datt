import Joi from "joi";
import mongoose, { Schema } from "mongoose";
import { TypeFile, StatusFile } from "../../interfaces/Enum";
import { IFile, IFileUpload } from "../../interfaces/IFile";

const fileSchema = new mongoose.Schema<IFile>(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true, default: StatusFile.pending },
    deleted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const validate = (file: IFileUpload): any => {
  const Schema = Joi.object({
    name: Joi.string().required().min(1).max(500),
    owner: Joi.string().required(),
    url: Joi.string().required(),
    type: Joi.valid(...Object.values(TypeFile)).required(),
  });
  return Schema.validate(file);
};

// Create Model
const File = mongoose.model("File", fileSchema);

// Export
export { File, validate };
