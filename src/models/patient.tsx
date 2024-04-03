import mongoose from "mongoose";
import { Forum } from "./forum";
import { User } from "./user";
import { LabReport } from "./laboratory";
import { Prescription } from "./doctor";

const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    name: {
      type: String,
    },
    mobile: {
      type: String,
    },
    nic: {
      type: String,
      required: true,
      unique: true,
    },
    labReports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: LabReport,
      },
    ],
    prescriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Prescription,
      },
    ],
    surgeries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Surgery",
      },
    ],
    chatMessages: [Forum.schema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  },
  { timestamps: true }
);

export const Patient =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);
