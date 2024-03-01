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

    const schema = z.object({
      pharmacyName: z.string(),
      pharmacyRegNo: z.string(),
      pharmacyLocation: z.string(),
      contactNumber: z.string(),
      email: z.string().email(),
      password: z.string(),
    });

    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ message: "Invalid input" }, { status: 422 });
    }

    const {
      pharmacyName,
      pharmacyRegNo,
      pharmacyLocation,
      contactNumber,
      email,
      password,
    } = result.data;

    //check if the PharmacyRegNo is already registered
    const isPharmacyExist = await Pharmacist.findOne({
      pharmacyRegNo,
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
      phone: contactNumber,
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
