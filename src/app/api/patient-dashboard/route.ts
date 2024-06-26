import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Doctor } from "@/models/doctor";
import { Patient } from "@/models/patient";
import { User } from "@/models/user";
import { formatDate } from "@/lib/date-format";

export const GET = auth(async (req) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ data: [], error: "User is required" });
  }
  await connect();

  const patient = await Patient.findOne({ user: id })
    .populate({
      path: "prescriptions",
      populate: {
        path: "doctor",
        model: Doctor,
        populate: {
          path: "user",
          model: User,
        },
      },
    })
    .populate({
      path: "surgeries",
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

  let prescriptionData: any = [];
  let surgeryData: any = [];
  let consultingData: any = [];
  let diseaseData: any = [];

  patient.prescriptions.forEach(
    (prescription: any, prescriptionIndex: number) => {
      consultingData.push({
        _id: prescription._id,
        index: prescriptionIndex + 1,
        createdAt: formatDate(prescription.createdAt),
        doctor: prescription.doctor.user.name,
        hospital: prescription.hospital,
      });
    }
  );

  patient.prescriptions.forEach(
    (prescription: any, prescriptionIndex: number) => {
      prescriptionData.push({
        _id: prescription._id,
        createdAt: formatDate(prescription.createdAt),
        doctor: prescription.doctor.user.name,
      });
    }
  );

  patient.surgeries.forEach((surgery: any, surgeryIndex: number) => {
    prescriptionData.push({
      _id: surgery._id,
      createdAt: formatDate(surgery.createdAt),
      doctor: surgery.doctor.user.name,
    });
  });

  prescriptionData = prescriptionData.map((row: any, index: number) => ({
    ...row,
    index: index + 1,
  }));

  patient.surgeries.forEach((surgery: any, surgeryIndex: number) => {
    surgeryData.push({
      _id: surgery._id,
      index: surgeryIndex + 1,
      createdAt: formatDate(surgery.createdAt),
      doctor: surgery.doctor.user.name,
    });
  });

  patient.prescriptions.forEach((disease: any, diseaseIndex: number) => {
    diseaseData.push({
      _id: disease._id,
      index: diseaseIndex + 1,
      createdAt: formatDate(disease.createdAt),
      disease: disease.disease,
    });
  });

  const patientData = {
    prescriptions: prescriptionData,
    surgeries: surgeryData,
    consulting: consultingData,
    disease: diseaseData,
    nic: patient.nic,
  };

  return Response.json({ data: patientData });
});
