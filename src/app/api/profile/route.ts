import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { User } from "@/models/user";

export const GET = auth(async (req) => {
  const userId = req.auth?.user?.id;
  await connect();
  const user = await User.findById(userId);
  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  const resUser = {
    name: user.name,
    phone: user.phone,
  };
  return Response.json({ data: resUser });
}) as any; // TODO: Fix `auth()` return type
