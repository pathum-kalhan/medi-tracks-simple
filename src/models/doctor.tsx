import mongoose from "mongoose";
import { User } from "./user";

const { Schema } = mongoose;

const doctorSchema = new Schema(
  {
    slmcNo: {
      type: String,
      required: true,
      unique: true,
    },
    prescriptions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],
    surgeries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Surgery",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  },
  { timestamps: true }
);

const prescriptionSchema = new Schema(
  {
    hospital: {
      type: String,
      required: true,
    },
    disease: {
      type: String,
      required: true,
    },
    medicine: {
      type: String,
      required: true,
    },
    validTill: {
      type: Date,
      required: true,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    doctorNotes: String,
    isIssued: {
      type: Boolean,
      default: false,
    },
    issuedRange: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const surgerySchema = new Schema(
  {
    hospital: {
      type: String,
      required: true,
    },
    medicine: {
      type: String,
      required: true,
    },
    validTill: {
      type: Date,
      required: true,
    },
    surgeryName: {
      type: String,
      required: true,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    doctorNotes: String,
    isIssued: {
      type: Boolean,
      default: false,
    },
    issuedRange: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Doctor =
  mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
export const Prescription =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", prescriptionSchema);
export const Surgery =
  mongoose.models.Surgery || mongoose.model("Surgery", surgerySchema);
