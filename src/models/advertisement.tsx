import mongoose, { Schema, mongo } from "mongoose";

const AdSchema = new Schema({
  URL: {
    type: String,
    required: true,
  },
});

export const Ad = mongoose.models.Ad || mongoose.model("Ad", AdSchema);
