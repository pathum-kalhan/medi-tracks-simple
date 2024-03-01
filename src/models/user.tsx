import { Schema, models, model } from "mongoose";
import { Doctor } from "@/models/doctor";

const userSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ["doctor", "patient", "laboratory", "pharmacist"],
    required: true,
  },
});

export const User = models.User || model("User", userSchema);
