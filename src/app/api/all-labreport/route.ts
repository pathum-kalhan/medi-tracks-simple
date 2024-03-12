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

  let data: any = [];

  labReports.forEach((labReport: any) => {
    data.push({
      _id: labReport._id,
      name: labReport.name,
      testType: labReport.testType,
      url: labReport.url,
      createdAt: formatDate(labReport.createdAt),
      patient: labReport.patient.name,
    });
  });

  return Response.json({ data: data });
});
