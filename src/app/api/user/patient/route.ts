"use server";
import { Patient } from "@/models/patient";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connect } from "@/lib/db";

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

    const newPatient = await Patient.create({
      name,
      nic,
      mobileNumber,
      password: hashedPassword,
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
