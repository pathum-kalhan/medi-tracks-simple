"use server";
import { Doctor } from "@/models/doctor";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connect } from "@/lib/db";

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

    const newDoctor = await Doctor.create({
      name,
      slmcNo,
      phone,
      password: hashedPassword,
    });

    return NextResponse.json(
      { user: newDoctor, message: "Doctor created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
