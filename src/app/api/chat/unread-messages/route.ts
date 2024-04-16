import { connect } from "@/lib/mongo";
import { Chat } from "@/models/chat";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const doctorUserId = searchParams.get("id");
  await connect();

  const unreadMessages = await Chat.find({
    receiverId: doctorUserId,
    read: false,
  }).countDocuments();

  return Response.json({ data: unreadMessages });
};
