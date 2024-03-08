"use server";

import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { LabReport, Laboratory } from "@/models/laboratory";
import { Patient } from "@/models/patient";
import { utapi } from "@/server/uploadthing";
import { z } from "zod";

export type State = {
  status: "success" | "error";
  message: string;
  errors?: {
    nic?: string[];
    name?: string[];
    testType?: string[];
    files?: string[];
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
  testType: z
    .string({
      required_error: "required field",
      invalid_type_error: "Test type is required",
    })
    .min(3, "Test type must be at least 3 characters"),
  files: z
    .instanceof(File)
    .refine(
      (value) => value.size < 1024 * 1024 * 3,
      "File size should be less than 3MB"
    )
    .array()
    .min(1, "Please upload a file"),
});

export async function fileUpload(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  const validationResult = formSchema.safeParse({
    nic: formData.get("nic"),
    name: formData.get("name"),
    testType: formData.get("testType"),
    files: formData.getAll("files"),
  });
  if (!validationResult.success) {
    return {
      status: "error",
      message: "Please fill the form correctly",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  await connect();
  const { nic, name, testType, files } = validationResult.data;
  const isPatientExist = await Patient.findOne({ nic }).populate("user");
  if (!isPatientExist) {
    return { status: "error", message: "Patient not found" };
  }

  const response = await utapi.uploadFiles(files[0]);
  const url = response?.data?.url;

  if (!url) {
    return { status: "error", message: "File upload failed" };
  }

  const session = await auth();
  const id = session?.user?.id;

  const laboratory = await Laboratory.findOne({ user: id });

  const labReport = await LabReport.create({
    name,
    testType,
    url,
    patient: isPatientExist.user._id,
    laboratory: laboratory._id,
  });

  if (!labReport) {
    return { status: "error", message: "Lab report creation failed" };
  }

  isPatientExist.labReports.push(labReport._id);
  await isPatientExist.save();

  const lab = await Laboratory.findOne({ user: id });
  lab.labReports.push(labReport._id);
  await lab.save();

  return { status: "success", message: "Lab report uploaded successfully" };
}
