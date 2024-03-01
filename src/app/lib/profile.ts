import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connect } from "@/lib/db";
import { Doctor } from "@/models/doctor";
import { compare, hash } from "bcryptjs";
import { User } from "@/models/user";

export async function updateProfile() {
  const session = await auth();

  return session;
}

export async function updateProfilePicture(picture: string) {
  const session = await auth();
  if (!session) {
    return {
      message: "Unauthorized",
    };
  }
  const doctor = await Doctor.findById(session?.user?.id);
  if (!doctor) {
    return {
      message: "Unauthorized",
    };
  }
  const user = await User.findById(doctor.user);

  return user;
}
