"use server";
import { signIn } from "@/auth";
import { connect } from "@/lib/mongo";
import { Doctor } from "@/models/doctor";
import { Laboratory } from "@/models/laboratory";
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
      invalid_type_error: "Laboratory Registration Number is required",
    })
    .min(3, "Laboratory Registration Number must be at least 3 characters"),
  password: z.string({
    required_error: "required field",
    invalid_type_error: "Password is required",
  }),
});

export async function logIn(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  console.log("im in the lab server action 1");

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
  console.log("before connect");
  await connect();
  console.log("after connect");

  const { regNo, password } = validationResult.data;
  const user = await Laboratory.findOne({ regNo }).populate("user");
  console.log(user, "user");
  if (!user) {
    return { status: "error", message: "Laboratory not found" };
  }
  console.log("im in the lab server action 2");
  const isPasswordMatch = await compare(password, user.user.password);
  if (!isPasswordMatch) {
    return { status: "error", message: "Password is incorrect" };
  }
  console.log(validationResult.data, "validationResult.data");
  await signIn("credentials", {
    user: "laboratory",
    ...validationResult.data,
  });
  return { status: "success", message: "Logged in successfully" };
}
