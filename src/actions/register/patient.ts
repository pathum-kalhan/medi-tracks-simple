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
    email?: string[];
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
    email: z
      .string({
        required_error: "required field",
        invalid_type_error: "Email is required",
      })
      .email("Please enter a valid email")
      .transform((data) => data.toLowerCase()),
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
    email: formData.get("email"),
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
  const { name, nic, email, phone, password } = validationResult.data;
  await connect();
  const isPatientExist = await Patient.findOne({ nic });
  const isUserExist = await User.findById(isPatientExist?.user);
  if (isPatientExist && isUserExist) {
    return { status: "error", message: "Patient already exist" };
  }
  const emailRegistered = await User.findOne({ email });
  if (emailRegistered) {
    return { status: "error", message: "Email already registered" };
  }

  const hashedPassword = await hash(password, 10);

  if (!isPatientExist && !isUserExist) {
    const newUser = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      userType: "patient",
    });

    const newPatient = await Patient.create({
      nic,
      user: newUser._id,
    });
  }

  if (isPatientExist && !isUserExist) {
    const newUser = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      userType: "patient",
    });

    isPatientExist.user = newUser._id;
    await isPatientExist.save();
  }

  return { status: "success", message: "Patient created successfully" };
}
