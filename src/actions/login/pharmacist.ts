"use server";
import { signIn } from "@/auth";
import { connect } from "@/lib/mongo";
import { Doctor } from "@/models/doctor";
import { Patient } from "@/models/patient";
import { Pharmacist } from "@/models/pharmacist";
import { User } from "@/models/user";
import { compare } from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
  status: "success" | "error";
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
} | null;

const formSchema = z.object({
  email: z
    .string({
      required_error: "required field",
      invalid_type_error: "Email is required",
    })
    .email("Please enter a valid email")
    .transform((data) => data.toLowerCase()),
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
    email: formData.get("email"),
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
  const { email, password } = validationResult.data;
  const user = await User.findOne({ email });
  if (user.status === "ban") {
    return { status: "error", message: "Your account is banned" };
  }
  const pharmacist = await Pharmacist.findOne({ user: user?._id });
  if (!pharmacist) {
    return { status: "error", message: "Pharmacist not found" };
  }
  const isPasswordMatch = await compare(password, user.password);
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
