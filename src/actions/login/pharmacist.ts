"use server";
import { signIn } from "@/auth";
import { connect } from "@/lib/mongo";
import { Doctor } from "@/models/doctor";
import { Patient } from "@/models/patient";
import { Pharmacist } from "@/models/pharmacist";
import { compare } from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
  status: "success" | "error";
  message: string;
  errors?: {
    regNo?: string[];
    password?: string[];
  };
} | null;

const formSchema = z.object({
  regNo: z
    .string({
      required_error: "required field",
      invalid_type_error: "Pharmacy Registration Number is required",
    })
    .min(3, "Pharmacy Registration Number must be at least 3 characters"),
  password: z.string({
    required_error: "required field",
    invalid_type_error: "Password is required",
  }),
});

export async function logIn(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  const validationResult = formSchema.safeParse({
    regNo: formData.get("regNo"),
    password: formData.get("password"),
  });

  if (!validationResult.success) {
    return {
      status: "error",
      message: "Please fill the form correctly",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  await connect();
  const { regNo, password } = validationResult.data;
  const user = await Pharmacist.findOne({ regNo }).populate("user");
  if (!user) {
    return { status: "error", message: "Pharmacist not found" };
  }
  const isPasswordMatch = await compare(password, user.user.password);
  if (!isPasswordMatch) {
    return { status: "error", message: "Password is incorrect" };
  }
  console.log(validationResult.data, "validationResult.data");
  await signIn("credentials", {
    user: "pharmacist",
    ...validationResult.data,
  });
  return { status: "success", message: "Logged in successfully" };
}
