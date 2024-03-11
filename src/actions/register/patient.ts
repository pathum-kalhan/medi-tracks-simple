"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Doctor } from "@/models/doctor";
import { Patient } from "@/models/patient";
import { User } from "@/models/user";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

export type State = {
  status: "success" | "error";
  message: string;
  errors?: {
    name?: string[];
    nic?: string[];
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
    nic: z
      .string({
        required_error: "required field",
        invalid_type_error: "NIC is required",
      })
      .refine(
        (value) => /^(?:\d{12}|\d{9}V)$/.test(value),
        "Please enter a valid NIC number ex: 123456789012 or 123456789V"
      ),
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

export async function patient(
  _prevState: State | null,
  formData: FormData
): Promise<State> {
  const session = await auth();
  if (session) {
    return { status: "error", message: "You are already logged in" };
  }
  const validationResult = formSchema.safeParse({
    name: formData.get("name"),
    nic: formData.get("nic"),
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
  const { name, nic, phone, password } = validationResult.data;
  await connect();
  const isDoctorExist = await Patient.findOne({ nic }).populate("user");
  if (isDoctorExist.user) {
    return { status: "error", message: "Patient already exist" };
  }

  const hashedPassword = await hash(password, 10);

  const newUser = await User.create({
    name,
    phone,
    password: hashedPassword,
    userType: "patient",
  });
  console.log(newUser._id, "newUser._id");

  if (isDoctorExist && !isDoctorExist.user) {
    await Patient.findOneAndUpdate({ nic }, { user: newUser._id });
  }

  if (!isDoctorExist && !isDoctorExist.user) {
    await Patient.create({
      nic,
      user: newUser._id,
    });
  }

  return { status: "success", message: "Patient created successfully" };
}
