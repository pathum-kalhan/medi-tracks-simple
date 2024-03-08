import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { LabReport, Laboratory } from "@/models/laboratory";
import { Patient } from "@/models/patient";
import { User } from "@/models/user";

export const GET = auth(async (req) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const nic = searchParams.get("nic");
  if (!nic) {
    return Response.json({ data: [], error: "Patient nic is required" });
  }

  // if (
  //   !(
  //     req.auth?.user?.type === "doctor" || req.auth?.user?.type === "pharmacist"
  //   )
  // ) {
  //   return Response.json({ data: [], error: "Unauthorized" });
  // }

  await connect();
  const patient = await Patient.findOne({ nic }).populate({
    path: "labReports",
    populate: {
      path: "laboratory",
      model: Laboratory,
      populate: {
        path: "user",
        model: User,
      },
    },
  });
  console.log(patient);
  if (!patient) {
    return Response.json({ data: [], error: "Patient not found" });
  }

  return Response.json({ data: patient.labReports });
});