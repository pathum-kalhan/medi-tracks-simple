"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Doctor } from "@/models/doctor";
import { User } from "@/models/user";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

export type State = {
  status: "success" | "error";
  message: string;
  errors?: {
    name?: string[];
    slmcNo?: string[];
    phone?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
} | null;

const formSchema = z
  .object({
    name: z
      .string({
        required_error: "required field",
        invalid_type_error: "Name is required",
      })
      .min(3, "Name must be at least 3 characters"),
    slmcNo: z
      .string({
        required_error: "required field",
        invalid_type_error: "NIC is required",
      })
      .min(3, "SLMCC No. must be at least 3 characters"),
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

export async function doctor(
  _prevState: State | null,
  formData: FormData
): Promise<State> {
  const session = await auth();
  if (session) {
    return { status: "error", message: "You are already logged in" };
  }
  const validationResult = formSchema.safeParse({
    name: formData.get("name"),
    slmcNo: formData.get("slmcNo"),
    phone: formData.get("phone"),
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
  const { name, slmcNo, phone, password } = validationResult.data;
  await connect();
  const isDoctorExist = await Doctor.findOne({ slmcNo });
  if (isDoctorExist) {
    return { status: "error", message: "Doctor already exist" };
  }
  const hashedPassword = await hash(password, 10);

  const newUser = await User.create({
    name,
    phone,
    password: hashedPassword,
    userType: "doctor",
  });
  console.log(newUser._id, "newUser._id");
  const newDoctor = await Doctor.create({
    slmcNo,
    user: newUser._id,
  });

  return { status: "success", message: "Doctor created successfully" };
}
