import mongoose, { Schema, mongo } from "mongoose";

const ChatSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
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
  read: {
    type: Boolean,
    required: true,
  },
});

export const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
