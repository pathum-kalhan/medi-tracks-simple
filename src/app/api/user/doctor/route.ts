import { Doctor } from "@/models/doctor";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connect } from "@/lib/db";
import { Schema } from "mongoose";

export async function POST(req: Request) {
  try {
    const conn = await connect();
    const body = await req.json();
    const { name, slmcNo, phone, password } = body;
    //check if the slmcNo is already registered
    const isDoctorExist = await Doctor.findOne({ slmcNo });
    if (isDoctorExist) {
      return NextResponse.json(
        { user: null, message: "Doctor already exist" },
        { status: 409 }
      );
    }
    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({
      name,
      phone,
      password: hashedPassword,
      userType: "doctor",
    });
    console.log(newUser._id, "newUser._id");
    const newDoctor = await Doctor.create({
      slmcNo,
      user: newUser._id,
    });
    console.log("Doctor created successfully", newDoctor);

    return NextResponse.json(
      { user: newDoctor, message: "Doctor created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams;
//   const query = searchParams.get("id");
//   if (!query) {
//     return NextResponse.json({ user: null });
//   }
//   try {
//     const conn = await connect();
//     const doctor = await Doctor.findOne({ slmcNo: query }).populate("user");
//     if (!doctor) {
//       return NextResponse.json({ user: null });
//     }
//     return NextResponse.json({ user: doctor });
//   } catch (error) {
//     return NextResponse.json({ message: "Something went wrong", error });
//   }
// }
