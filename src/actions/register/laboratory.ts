"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Doctor } from "@/models/doctor";
import { Laboratory } from "@/models/laboratory";
import { Pharmacist } from "@/models/pharmacist";
import { User } from "@/models/user";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

export type State = {
  status: "success" | "error";
  message: string;
  errors?: {
    name?: string[];
    regNo?: string[];
    location?: string[];
    phone?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
} | null;

const formSchema = z
  .object({
    name: z
      .string({
        required_error: "required field",
        invalid_type_error: "Laboratory Name is required",
      })
      .min(3, "Laboratory Name must be at least 3 characters"),
    regNo: z
      .string({
        required_error: "required field",
        invalid_type_error: "Laboratory Registration Number is required",
      })
      .min(3, "Laboratory Registration Number must be at least 3 characters"),
    location: z
      .string({
        required_error: "required field",
        invalid_type_error: "Laboratory Location is required",
      })
      .min(3, "Laboratory Location must be at least 3 characters"),
    phone: z
      .string({
        required_error: "required field",
        invalid_type_error: "Mobile number is required",
      })
      .refine(
        (value) => /^(?:\d{10})$/.test(value),
        "Please enter a valid mobile number ex: 0771234568"
      )
      .transform((data) => Number(data)),
    email: z
      .string({
        required_error: "required field",
        invalid_type_error: "Email is required",
      })
      .email("Please enter a valid email")
      .transform((data) => data.toLowerCase()),
    password: z
      .string({
        required_error: "required field",
        invalid_type_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string({
      required_error: "required field",
      invalid_type_error: "Confirm Password is required",
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export async function laboratory(
  _prevState: State | null,
  formData: FormData
): Promise<State> {
  const session = await auth();
  if (session) {
    return { status: "error", message: "You are already logged in" };
  }
  const validationResult = formSchema.safeParse({
    name: formData.get("name"),
    regNo: formData.get("regNo"),
    location: formData.get("location"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!validationResult.success) {
    return {
      status: "error",
      message: "Please fill the form correctly",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  const { name, regNo, location, phone, email, password } =
    validationResult.data;
  await connect();
  const isDoctorExist = await Laboratory.findOne({ regNo });
  if (isDoctorExist) {
    return { status: "error", message: "Laboratory already exist" };
  }
  const emailRegistered = await User.findOne({ email });
  if (emailRegistered) {
    return { status: "error", message: "Email already registered" };
  }
  const hashedPassword = await hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    userType: "laboratory",
  });

  const newLaboratory = await Laboratory.create({
    regNo,
    location,
    email,
    user: newUser._id,
  });

  return { status: "success", message: "Laboratory created successfully" };
}
