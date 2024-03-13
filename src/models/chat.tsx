import mongoose, { Schema, mongo } from "mongoose";

const chatMessageSchema = new Schema({
  senderRole: {
    type: String,
    enum: ["patient", "doctor"],
    required: true,
  },
  forum: {
    type: String,
    enum: ["patient", "doctor"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  avatarDisp: {
    type: Boolean,
    required: true,
  },
  photoURL: {
    type: String,
  },
});

export const ChatMessage =
  mongoose.models.ChatMessage ||
  mongoose.model("ChatMessage", chatMessageSchema);
