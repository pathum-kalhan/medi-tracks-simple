import { connect } from "@/lib/mongo";
import { Forum } from "@/models/forum";
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
    forum,
  } = body;

  await connect();

  const newMessage = await Forum.create({
    userId,
    senderRole,
    message,
    timestamp,
    displayName,
    avatarDisp,
    photoURL,
    forum,
  });

  console.log("Message saved to database:", newMessage);

  return Response.json({ message: "Message sent" });
};

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const forum = searchParams.get("forum");
  await connect();

  const messages = await Forum.find({ forum });
  return Response.json(messages);
};
