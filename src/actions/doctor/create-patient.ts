"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Doctor, Prescription } from "@/models/doctor";
import { Patient } from "@/models/patient";
import { User } from "@/models/user";
import { revalidateTag } from "next/cache";
import { permanentRedirect, redirect } from "next/navigation";
import { z } from "zod";

export type State = {
  status: "success" | "error" | "search";
  message: string;
  errors?: {
    nic?: string[];
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
});

export async function createPatient(
  _prevState: State,
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
  });

  if (!validationResult.success) {
    return {
      status: "error",
      message: "NIC number is required for creating a patient record",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  const { nic } = validationResult.data;
  await connect();

  const isPatientExist = await Patient.findOne({ nic: nic });
  if (isPatientExist) {
    return { status: "search", message: nic };
  }

  const patient = await Patient.create({
    nic,
  });

  return { status: "success", message: patient.nic };
}
