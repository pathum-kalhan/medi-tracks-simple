"use server";
import { Patient } from "@/models/patient";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connect } from "@/lib/db";
import { User } from "@/models/user";

export async function POST(req: Request) {
  try {
    const conn = await connect();
    const body = await req.json();
    const { name, nic, mobileNumber, password } = body;

    //check if the nic is already registered
    const isPatientExist = await Patient.findOne({ nic });
    if (isPatientExist) {
      return NextResponse.json(
        { user: null, message: "Patient already exist" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({
      name,
      phone: mobileNumber,
      password: hashedPassword,
      userType: "patient",
    });

    const newPatient = await Patient.create({
      nic,
      user: newUser._id,
    });

    return NextResponse.json(
      { user: newPatient, message: "Patient created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
