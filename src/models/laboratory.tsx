import mongoose, { Schema } from "mongoose";
import email from "next-auth/providers/email";

const laboratorySchema = new Schema({
  labName: {
    type: String,
    required: true,
  },
  labRegNo: {
    type: String,
    required: true,
    unique: true,
  },
  labLocation: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
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
});

const labReportSchema = new Schema({
  patientNIC: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  testType: {
    type: String,
    required: true,
  },
  uploadedDocument: {
    type: String,
    required: true,
  },
});

export const Laboratory =
  mongoose.models.Laboratory || mongoose.model("Laboratory", laboratorySchema);
export const LabReport =
  mongoose.models.LabReport || mongoose.model("LabReport", labReportSchema);
