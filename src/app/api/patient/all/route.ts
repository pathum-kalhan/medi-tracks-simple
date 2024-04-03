import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Patient } from "@/models/patient";

export const GET = auth(async (req) => {
  await connect();
  const user = await Patient.find({}).populate({
    path: "user",
    select: "name",
  });

  const response: { id: string; name: string }[] = [];
  user.forEach((u) => {
    if (u.user) {
      response.push({ id: u.user._id, name: u.user.name });
    }
  });
  return Response.json({ data: response });
});
