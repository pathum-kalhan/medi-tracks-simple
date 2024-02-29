import mongoose from "mongoose";

const { Schema } = mongoose;

const doctorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slmcNo: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
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
});

const prescriptionSchema = new Schema({
  doctorName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
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
  doctorNotes: String,
});

const surgerySchema = new Schema({
  doctorName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
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
  doctorNotes: String,
});

export const Doctor =
  mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
export const Prescription =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", prescriptionSchema);
export const Surgery =
  mongoose.models.Surgery || mongoose.model("Surgery", surgerySchema);
