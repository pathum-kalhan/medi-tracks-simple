import { User } from "@/models/user";
import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
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
  try {
    await connect();
    const body = await req.json();
    const { user, password } = body;

    let fetchUser;

    if (user === "doctor") {
      const { slmcNo } = body;
      const doctor = await Doctor.findOne({ slmcNo }).populate("user");
      if (!doctor) {
        return Response.json({ message: "Doctor not found" }, { status: 404 });
      }

      fetchUser = doctor.user;
      const isValid = await compare(password, fetchUser.password);
      if (!isValid) {
        return Response.json({ message: "Invalid password" }, { status: 401 });
      }

      return Response.json({ user: fetchUser }, { status: 200 });
    } else if (user === "patient") {
      const { nic } = body;
      const patient = await Patient.findOne({ nic: nic }).populate("user");

      if (!patient) {
        return Response.json({ message: "Patient not found" }, { status: 404 });
      }

      fetchUser = patient.user;
      const isValid = await compare(password, fetchUser.password);
      if (!isValid) {
        return Response.json({ message: "Invalid password" }, { status: 401 });
      }

      return Response.json({ user: fetchUser }, { status: 200 });
    } else if (user === "laboratory") {
      const { regNo } = body;
      const lab = await Laboratory.findOne({ regNo }).populate("user");

      if (!lab) {
        return Response.json(
          { message: "Laboratory not found" },
          { status: 404 }
        );
      }

      fetchUser = lab.user;
      const isValid = await compare(password, fetchUser.password);
      if (!isValid) {
        return Response.json({ message: "Invalid password" }, { status: 401 });
      }

      return Response.json({ user: fetchUser }, { status: 200 });
    } else {
      const { regNo } = body;
      const pharmacist = await Pharmacist.findOne({ regNo }).populate("user");

      if (!pharmacist) {
        return Response.json(
          { message: "Pharmacist not found" },
          { status: 404 }
        );
      }

      fetchUser = pharmacist.user;
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
