import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Doctor } from "@/models/doctor";

export const GET = auth(async (req) => {
  await connect();
  const user = await Doctor.find({}).populate({
    path: "user",
    select: "name",
  });

  const response = user.map((user) => {
    return {
      id: user.user._id,
      name: user.user.name,
    };
  });
  return Response.json({ data: response });
});
