"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Doctor, Prescription } from "@/models/doctor";
import { Patient } from "@/models/patient";
import { User } from "@/models/user";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export type State = {
  status: "success" | "error";
  message: string;
  errors?: {
    nic?: string[];
    name?: string[];
    phone?: string[];
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
  name: z
    .string({
      required_error: "required field",
      invalid_type_error: "Name is required",
    })
    .min(3, "Name must be at least 3 characters"),
  phone: z
    .string({
      required_error: "required field",
      invalid_type_error: "Mobile is required",
    })
    .refine(
      (value) => /^[0-9]{10}$/.test(value),
      "Please enter a valid mobile number ex: 0771234567"
    ),
});

export async function createPatient(
  _prevState: State | null,
  formData: FormData
): Promise<State> {
  const session = await auth();
  if (!session) {
    return { status: "error", message: "Please login first" };
  }
  const userId = session.user?.id;
  const type = session.user?.type;
  if (!userId) {
    return { status: "error", message: "Please login first" };
  }

  if (!(type === "doctor")) {
    return {
      status: "error",
      message: "You are not authorized to create patients",
    };
  }

  const validationResult = formSchema.safeParse({
    nic: formData.get("nic") as string,
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
  });

  if (!validationResult.success) {
    return {
      status: "error",
      message: "Please fill the form correctly",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  const { nic, name, phone } = validationResult.data;
  await connect();

  const isPatientExist = await Patient.findOne({ nic: nic });
  if (isPatientExist) {
    return {
      status: "error",
      message: "Patient already exist",
    };
  }

  const user = await User.create({
    name,
    phone,
    userType: "patient",
  });

  const patient = await Patient.create({
    nic,
    user: user._id,
  });

  return { status: "success", message: "Patient created successfully" };
}
