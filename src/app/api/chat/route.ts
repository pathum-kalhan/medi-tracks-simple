import { connect } from "@/lib/mongo";
import { ChatMessage } from "@/models/chat";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const {
    userId,
    senderRole,
    message,
    timestamp,
    displayName,
    avatarDisp,
    photoURL,
  } = body;

  await connect();

  const newMessage = await ChatMessage.create({
    userId,
    senderRole,
    message,
    timestamp,
    displayName,
    avatarDisp,
    photoURL,
  });

  console.log("Message saved to database:", newMessage);

  return Response.json({ message: "Message sent" });
};

export const GET = async (req: NextRequest) => {
  await connect();

  const messages = await ChatMessage.find({});
  return Response.json(messages);
};
