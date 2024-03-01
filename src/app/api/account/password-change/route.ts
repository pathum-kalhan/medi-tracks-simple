import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const user = await auth();
  try {
    console.log(user, "user");
    return NextResponse.json({ message: user });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
