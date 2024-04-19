import { Schema, models, model } from "mongoose";
import { Doctor } from "@/models/doctor";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String },
  userType: {
    type: String,
    enum: ["doctor", "patient", "laboratory", "pharmacist", "admin"],
    required: true,
  },
  avatar: { type: String },
  notifications: [
    {
      message: { type: String },
      read: { type: Boolean, default: false },
    },
  ],
  status: {
    type: String,
    default: "active",
  },
});

export const User = models.User || model("User", userSchema);
