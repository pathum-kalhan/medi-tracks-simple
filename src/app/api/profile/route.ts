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
    avatar: user.avatar,
    notifications: user.notifications,
  };
  return Response.json({ data: resUser });
}) as any; // TODO: Fix `auth()` return type

export const PUT = auth(async (req) => {
  console.log("hello");
  const userId = req.auth?.user?.id;
  const body = await req.json();
  const { read, _id } = body;
  await connect();
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        "notifications.$[elem].read": read,
      },
    },
    {
      arrayFilters: [{ "elem._id": _id }],
      new: true,
    }
  );
  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }
  return Response.json({ data: user });
});
