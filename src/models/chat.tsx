import mongoose, { Schema, mongo } from "mongoose";

const chatMessageSchema = new Schema({
  senderRole: {
    type: String,
    enum: ["patient", "doctor"],
    required: true,
  },
  message: {
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
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const ChatMessage =
  mongoose.models.ChatMessage ||
  mongoose.model("ChatMessage", chatMessageSchema);
