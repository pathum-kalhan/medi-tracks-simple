import { updateProfile } from "@/app/lib/profile";
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connect();
    const res = await updateProfile();
    console.log(res);
    return NextResponse.json({ message: res });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" });
  }
}
