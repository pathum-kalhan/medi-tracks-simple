import { auth } from "@/auth";
import { formatDate } from "@/lib/date-format";
import { connect } from "@/lib/mongo";
import { Doctor } from "@/models/doctor";
import { Patient } from "@/models/patient";
import { User } from "@/models/user";

export const GET = auth(async (req) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const nic = searchParams.get("nic");
  const id = searchParams.get("doctorId");

  if (!nic) {
    return Response.json({ data: [], error: "Patient nic is required" });
  }

  await connect();

  const patient = await Patient.findOne({ nic }).populate({
    path: "prescriptions",
    populate: {
      path: "doctor",
      model: Doctor,
      populate: {
        path: "user",
        model: User,
      },
    },
  });

  if (!patient) {
    return Response.json({ data: [], error: "Patient not found" });
  }

  let consultingData: any = [];
  let diseaseData: any = [];

  patient.prescriptions.forEach((prescription: any) => {
    consultingData.push({
      _id: prescription._id,
      createdAt: formatDate(prescription.createdAt),
      doctor: prescription.doctor.user.name,
      hospital: prescription.hospital,
    });
  });

  patient.prescriptions.forEach((disease: any) => {
    diseaseData.push({
      _id: disease._id,
      createdAt: formatDate(disease.createdAt),
      disease: disease.disease,
    });
  });

  const patientData = {
    consulting: consultingData,
    disease: diseaseData,
  };

  return Response.json({ data: patientData });
});
