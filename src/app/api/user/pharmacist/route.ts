"use server";
import { Pharmacist } from "@/models/pharmacist";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connect } from "@/lib/db";
import { z } from "zod";
import { User } from "@/models/user";

export async function POST(req: Request) {
  try {
    const conn = await connect();
    const body = await req.json();

    const {
      pharmacyName,
      pharmacyRegNo,
      pharmacyLocation,
      contactNo,
      email,
      password,
    } = body;

    //check if the PharmacyRegNo is already registered
    const isPharmacyExist = await Pharmacist.findOne({
      regNo: pharmacyRegNo,
    });
    if (isPharmacyExist) {
      return NextResponse.json(
        { user: null, message: "Pharmacist already exist" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({
      name: pharmacyName,
      phone: contactNo,
      password: hashedPassword,
      userType: "pharmacist",
    });

    const newPharmacist = await Pharmacist.create({
      regNo: pharmacyRegNo,
      location: pharmacyLocation,
      email,
      user: newUser._id,
    });

    return NextResponse.json(
      { user: newPharmacist, message: "Pharmacist created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
