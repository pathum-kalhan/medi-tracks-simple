import mongoose, { Schema } from "mongoose";

const pharmacistSchema = new Schema({
  pharmacyName: {
    type: String,
    required: true,
  },
  pharmacyRegNo: {
    type: String,
    required: true,
    unique: true,
  },
  pharmacyLocation: {
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
});

export const Pharmacist =
  mongoose.models.Pharmacist || mongoose.model("Pharmacist", pharmacistSchema);
