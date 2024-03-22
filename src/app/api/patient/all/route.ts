import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Patient } from "@/models/patient";

export const GET = auth(async (req) => {
  await connect();
  const user = await Patient.find({}).populate({
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
