"use server";
import { Laboratory } from "@/models/laboratory";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connect } from "@/lib/db";
import { User } from "@/models/user";

export async function POST(req: Request) {
  try {
    const conn = await connect();
    const body = await req.json();
    const { labName, labRegNo, labLocation, contactNo, email, password } = body;

    //check if the labRegNo is already registered
    const isLaboratoryExist = await Laboratory.findOne({ regNo: labRegNo });
    if (isLaboratoryExist) {
      return NextResponse.json(
        { user: null, message: "Laboratory already exist" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({
      name: labName,
      phone: contactNo,
      password: hashedPassword,
      userType: "laboratory",
    });

    const newLab = await Laboratory.create({
      regNo: labRegNo,
      location: labLocation,
      email: email,
      user: newUser._id,
    });

    return NextResponse.json(
      { user: newLab, message: "Laboratory created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
