"use server";
import { signIn } from "@/auth";
import { connect } from "@/lib/mongo";
import { Doctor } from "@/models/doctor";
import { Patient } from "@/models/patient";
import { compare } from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
  status: "success" | "error";
  message: string;
  errors?: {
    nic?: string[];
    password?: string[];
  };
} | null;

const formSchema = z.object({
  nic: z
    .string({
      required_error: "required field",
      invalid_type_error: "NIC is required",
    })
    .refine(
      (value) => /^(?:\d{12}|\d{9}V)$/.test(value),
      "Please enter a valid NIC number ex: 123456789012 or 123456789V"
    ),
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
    nic: formData.get("nic"),
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
  const { nic, password } = validationResult.data;
  const user = await Patient.findOne({ nic }).populate("user");
  if (!user) {
    return { status: "error", message: "Patient not found" };
  }
  console.log(user, "user");
  if (!user.user) {
    return { status: "error", message: "Please register first " };
  }
  const isPasswordMatch = await compare(password, user.user.password);
  if (!isPasswordMatch) {
    return { status: "error", message: "Password is incorrect" };
  }
  console.log(validationResult.data, "validationResult.data");
  await signIn("credentials", {
    user: "patient",
    ...validationResult.data,
  });
  return { status: "success", message: "Logged in successfully" };
}
