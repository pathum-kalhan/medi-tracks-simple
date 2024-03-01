import mongoose from "mongoose";
import { ChatMessage } from "./chat";

const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    nic: {
      type: String,
      required: true,
      unique: true,
    },
    labReports: [
      {
        type: Schema.Types.ObjectId,
        ref: "LabReport",
      },
    ],
    prescriptions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],
    chatMessages: [ChatMessage.schema],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Patient =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);
