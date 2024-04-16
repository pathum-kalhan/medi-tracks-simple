import { connect } from "@/lib/mongo";
import { Chat } from "@/models/chat";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const {
    senderId,
    receiverId,
    message,
    timestamp,
    displayName,
    avatarDisp,
    photoURL,
  } = body;

  await connect();

  const newMessage = await Chat.create({
    senderId,
    receiverId,
    message,
    timestamp,
    displayName,
    avatarDisp,
    photoURL,
    read: false,
  });

  console.log("Message saved to database:", newMessage);

  return Response.json({ message: "Message sent" });
};

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const senderId = searchParams.get("senderId");
  const receiverId = searchParams.get("receiverId");
  await connect();

  const senderMessage = await Chat.find({
    senderId: senderId,
    receiverId: receiverId,
  });

  const receiverMessage = await Chat.find({
    senderId: receiverId,
    receiverId: senderId,
  });

  senderMessage.forEach(async (message) => {
    if (!message.read) {
      await Chat.findByIdAndUpdate(message._id, { read: true });
    }
  });

  receiverMessage.forEach(async (message) => {
    if (!message.read) {
      await Chat.findByIdAndUpdate(message._id, { read: true });
    }
  });

  const messages = senderMessage.concat(receiverMessage).sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  return Response.json(messages);
};
