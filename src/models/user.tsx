import mongoose from "mongoose";
import { Doctor } from "@/models/doctor";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String },
  userType: {
    type: String,
    enum: ["doctor", "patient", "laboratory", "pharmacist"],
    required: true,
  },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
