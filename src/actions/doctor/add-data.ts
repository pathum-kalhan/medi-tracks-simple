"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Doctor, Prescription, Surgery } from "@/models/doctor";
import { Patient } from "@/models/patient";
import { User } from "@/models/user";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export type State = {
  status: "success" | "error";
  message: string;
  errors?: {
    hospital?: string[];
    disease?: string[];
    medicine?: string[];
    doctorNote?: string[];
    validTill?: string[];
    nic?: string[];
    surgeryName?: string[];
    type?: string[];
  };
} | null;

const formSchema = z.object({
  hospital: z.string(),
  disease: z.string(z.string()),
  medicine: z.string(),
  validTill: z.string(),
  doctorNotes: z.string(),
  nic: z.string({}),
  surgeryName: z.optional(z.string()),
  type: z.string(),
});

export async function createPrescription(
  _prevState: State | null,
  formData: FormData
): Promise<State> {
  const session = await auth();
  if (!session) {
    return { status: "error", message: "Please login first" };
  }
  const userId = session.user?.id;
  const userType = session.user?.type;
  if (!userId) {
    return { status: "error", message: "Please login first" };
  }

  if (!(userType === "doctor")) {
    return {
      status: "error",
      message: "You are not authorized to prescribe medication",
    };
  }

  const validationResult = formSchema.safeParse({
    hospital: formData.get("hospital"),
    disease: formData.get("disease") ?? "",
    medicine: formData.get("medicine"),
    validTill: formData.get("validTill"),
    doctorNotes: formData.get("doctorNotes"),
    surgeryName: formData.get("surgeryName") ?? "",
    nic: formData.get("nic"),
    type: formData.get("type"),
  });

  if (!validationResult.success) {
    return {
      status: "error",
      message: "Please fill the form correctly",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  const {
    hospital,
    disease,
    medicine,
    validTill,
    doctorNotes,
    nic,
    surgeryName,
    type,
  } = validationResult.data;
  await connect();

  const user = await User.findById(userId);
  const doctor = await Doctor.findOne({ user: user?._id });

  const patient = await Patient.findOne({ nic: nic });

  if (!patient) {
    return { status: "error", message: "Patient not found" };
  }

  if (type === "surgery") {
    const surgery = await Surgery.create({
      hospital,
      surgeryName,
      medicine,
      validTill,
      doctorNotes,
      doctor,
      patient,
    });

    await doctor.surgeries.push(surgery);
    await doctor.save();

    await patient.surgeries.push(surgery);
    await patient.save();

    await revalidateTag("surgery");
    return { status: "success", message: "Surgery added successfully" };
  }

  const prescription = await Prescription.create({
    hospital,
    disease,
    medicine,
    validTill,
    doctorNotes,
    doctor,
    patient,
  });

  await doctor.prescriptions.push(prescription);
  await doctor.save();

  await patient.prescriptions.push(prescription);
  await patient.save();

  await revalidateTag("prescription");
  return { status: "success", message: "Prescription added successfully" };
}
