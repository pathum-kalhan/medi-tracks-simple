import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { User } from "@/models/user";
import { Doctor } from "@/models/doctor";
import { compare } from "bcryptjs";
import toast from "react-hot-toast";
import { Patient } from "@/models/patient";
import { Laboratory } from "@/models/laboratory";
import { Pharmacist } from "@/models/pharmacist";
export const GET = auth(async (req) => {
  await connect();
  const u = await User.findById("65e0b866ab7fcc16787b3324");
  if (req.auth) {
    return Response.json({ data: "Protected data", auth: req.auth });
  }

  return Response.json(
    { message: "Not authenticated", u: u, req: req },
    { status: 401 }
  );
}) as any; // TODO: Fix `auth()` return type

export const POST = auth(async (req) => {
  console.log("in the route handler");
  try {
    await connect();
    const body = await req.json();
    const { user, password } = body;

    let fetchUser;

    if (user === "admin") {
      const { email } = body;
      const admin = await User.findOne({ email });
      return Response.json({ user: admin }, { status: 200 });
    } else if (user === "doctor") {
      const { email } = body;
      const fetchUser = await User.findOne({ email });
      const isValid = await compare(password, fetchUser.password);
      if (!isValid) {
        return Response.json({ message: "Invalid password" }, { status: 401 });
      }
      return Response.json({ user: fetchUser }, { status: 200 });
    } else if (user === "patient") {
      const { email } = body;
      const fetchUser = await User.findOne({ email });
      const isValid = await compare(password, fetchUser.password);
      if (!isValid) {
        return Response.json({ message: "Invalid password" }, { status: 401 });
      }
      return Response.json({ user: fetchUser }, { status: 200 });
    } else if (user === "laboratory") {
      const { email } = body;
      const fetchUser = await User.findOne({ email });
      const isValid = await compare(password, fetchUser.password);
      if (!isValid) {
        return Response.json({ message: "Invalid password" }, { status: 401 });
      }
      return Response.json({ user: fetchUser }, { status: 200 });
    } else {
      const { email } = body;
      const fetchUser = await User.findOne({ email });
      const isValid = await compare(password, fetchUser.password);
      if (!isValid) {
        return Response.json({ message: "Invalid password" }, { status: 401 });
      }

      return Response.json({ user: fetchUser }, { status: 200 });
    }
  } catch (e) {
    console.error(e);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}) as any; // TODO: Fix `auth()` return type
