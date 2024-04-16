import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Chat } from "@/models/chat";
import { Patient } from "@/models/patient";

async function userUnreadMsgCount(id: string) {
  await connect();
  const chat = await Chat.find({
    senderId: id,
    read: false,
  }).countDocuments();

  return chat;
}

export const GET = auth(async (req) => {
  await connect();
  const user = await Patient.find({}).populate({
    path: "user",
    select: "name",
  });

  const response: { id: string; name: string }[] = [];
  user.forEach((u) => {
    if (u.user) {
      response.push({
        id: u.user._id,
        name: u.user.name,
      });
    }
  });

  const data: { id: string; name: string; unread: number }[] = [];

  for (const user of response) {
    const unread = await userUnreadMsgCount(user.id);
    data.push({
      id: user.id,
      name: user.name,
      unread,
    });
  }

  return Response.json({ data: data });
});
