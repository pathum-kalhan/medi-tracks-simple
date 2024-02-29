"use server";
import { Laboratory } from "@/models/laboratory";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connect } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const conn = await connect();
    const body = await req.json();
    const { labName, labRegNo, labLocation, contactNumber, email, password } =
      body;

    //check if the labRegNo is already registered
    const isLaboratoryExist = await Laboratory.findOne({ labRegNo });
    if (isLaboratoryExist) {
      return NextResponse.json(
        { user: null, message: "Laboratory already exist" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newLab = await Laboratory.create({
      labName,
      labRegNo,
      labLocation,
      contactNumber,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { user: newLab, message: "Laboratory created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
