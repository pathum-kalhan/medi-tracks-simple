"use server";
import { signIn } from "@/auth";
import { connect } from "@/lib/mongo";
import { Doctor } from "@/models/doctor";
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
  email: z.string({
    required_error: "required field",
    invalid_type_error: "Email is required",
  }),
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
  if (!user) {
    return { status: "error", message: "Admin not found" };
  }
  const isPasswordMatch = await compare(password, user.password);
  if (!isPasswordMatch) {
    return { status: "error", message: "Password is incorrect" };
  }
  console.log(validationResult.data, "validationResult.data");
  await signIn("credentials", {
    user: "admin",
    ...validationResult.data,
  });
  return { status: "success", message: "Logged in successfully" };
}
