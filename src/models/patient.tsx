import mongoose, { Schema } from "mongoose";
import { chatMessageSchema } from "./chat";

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
  chatMessages: [chatMessageSchema],
});

export const Patient = mongoose.model("Patient", patientSchema);
