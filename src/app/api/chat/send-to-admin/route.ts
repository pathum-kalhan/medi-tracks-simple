import { connect } from "@/lib/mongo";
import { Chat } from "@/models/chat";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const senderId = searchParams.get("senderId");
  await connect();

  const senderMessage = await Chat.find({
    senderId: senderId,
    receiverId: "661ce5b035c0d73ab2dfa45c",
  });

  return Response.json(senderMessage);
};
