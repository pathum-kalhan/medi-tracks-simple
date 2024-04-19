import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { User } from "@/models/user";

export const GET = auth(async (req) => {
  if (req.auth?.user?.type !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connect();
  try {
    const users = await User.find({ userType: { $ne: "admin" } });

    return Response.json({ data: users });
  } catch (error) {
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}) as any; // TODO: Fix `auth()` return type

export const PUT = auth(async (req) => {
  if (req.auth?.user?.type !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connect();
  try {
    const body = await req.json();
    const { id, status } = body;
    const user = await User.findByIdAndUpdate(id, { status });
    return Response.json({ data: user });
  } catch (error) {
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}) as any; // TODO: Fix `auth()` return type
