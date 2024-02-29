import mongoose from "mongoose";
import { ChatMessage } from "./chat";

const { Schema } = mongoose;

const patientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
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
});

export const Patient =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);
