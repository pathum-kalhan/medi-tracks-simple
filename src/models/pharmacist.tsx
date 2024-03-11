import mongoose, { Schema } from "mongoose";
import { User } from "./user";

const pharmacistSchema = new Schema(
  {
    regNo: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  },
  { timestamps: true }
);

export const Pharmacist =
  mongoose.models.Pharmacist || mongoose.model("Pharmacist", pharmacistSchema);
