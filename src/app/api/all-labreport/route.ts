import { auth } from "@/auth";
import { formatDate } from "@/lib/date-format";
import { connect } from "@/lib/mongo";
import { LabReport, Laboratory } from "@/models/laboratory";
import { Patient } from "@/models/patient";
import { User } from "@/models/user";
import { create } from "domain";

export const GET = auth(async (req) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );

  const nic = searchParams.get("nic");

  let data: any = [];

  // if (
  //   !(
  //     req.auth?.user?.type === "doctor" || req.auth?.user?.type === "pharmacist"
  //   )
  // ) {
  //   return Response.json({ data: [], error: "Unauthorized" });
  // }

  await connect();
  const laboratory = await Laboratory.findOne({ user: req.auth?.user?.id });
  const labReports = await LabReport.find({ laboratory: laboratory?._id });

  labReports.forEach((labReport: any) => {
    data.push({
      _id: labReport._id,
      name: labReport.name,
      testType: labReport.testType,
      url: labReport.url,
      createdAt: formatDate(labReport.createdAt),
      patient: labReport?.patient?.name,
    });
  });

  if (labReports.length === 0 && req.auth?.user?.type === "doctor") {
    const patient = await Patient.findOne({ nic }).populate("labReports");
    patient.labReports.forEach((labReport: any) => {
      data.push({
        _id: labReport._id,
        name: labReport.name,
        testType: labReport.testType,
        url: labReport.url,
        createdAt: formatDate(labReport.createdAt),
        patient: labReport?.patient?.name,
      });
    });
  }

  return Response.json({ data: data });
});
