import mongoose, { Schema } from "mongoose";
import email from "next-auth/providers/email";

const laboratorySchema = new Schema(
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

    labReports: [
      {
        type: Schema.Types.ObjectId,
        ref: "LabReport",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const labReportSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

export const Laboratory =
  mongoose.models.Laboratory || mongoose.model("Laboratory", laboratorySchema);
export const LabReport =
  mongoose.models.LabReport || mongoose.model("LabReport", labReportSchema);