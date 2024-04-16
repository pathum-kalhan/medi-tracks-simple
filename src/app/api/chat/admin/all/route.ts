import { connect } from "@/lib/mongo";
import { Chat } from "@/models/chat";
import { User } from "@/models/user";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  await connect();

  const senderMessage = await Chat.find({
    receiverId: "661ce5b035c0d73ab2dfa45c",
  });

  const senderIds: string[] = senderMessage.map((message) => message.senderId);

  const uniqueSenderIds = Array.from(new Set(senderIds));

  const data: { id: string; name: string }[] = [];

  for (const senderId of uniqueSenderIds) {
    const user = await User.findById(senderId);
    data.push({
      id: senderId,
      name: user?.name,
    });
  }

  console.log(data);

  return Response.json(data);
};
