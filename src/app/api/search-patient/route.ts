import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Patient } from "@/models/patient";

export const GET = auth(async (req) => {
  const { searchParams } = new URL(req.url, "http://localhost:3000");
  const nic = searchParams.get("nic");
  if (!nic) {
    return Response.json({ data: [], error: "NIC is required" });
  }
  //   console.log(req.cookies, "cookies");
  //   if (
  //     !(
  //       req.auth?.user?.type === "doctor" || req.auth?.user?.type === "pharmacist"
  //     )
  //   ) {
  //     return Response.json({ data: [], error: "Unauthorized" });
  //   }

  await connect();
  const patient = await Patient.findOne({ nic: nic }).populate("user");
  if (!patient) {
    return Response.json({ data: [], error: "Patient not found" });
  }

  const patientData = [
    {
      nic: patient.nic,
      name: patient.user.name,
      phone: patient.user.phone,
      labReports: patient.labReports,
      prescriptions: patient.prescriptions,
    },
  ];
  return Response.json({ data: patientData });
});
