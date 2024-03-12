import { auth } from "@/auth";
import { formatDate } from "@/lib/date-format";
import { connect } from "@/lib/mongo";
import { Doctor } from "@/models/doctor";
import { LabReport, Laboratory } from "@/models/laboratory";
import { Patient } from "@/models/patient";
import { User } from "@/models/user";

export const GET = auth(async (req) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const nic = searchParams.get("nic");
  const place = searchParams.get("place");
  const id = searchParams.get("doctorId");
  const type = searchParams.get("type");

  const userType = req.auth?.user?.type ?? type;
  const doctorId = req.auth?.user?.id ?? id;

  console.log(userType, doctorId, "userType");

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
  const doctor = await Doctor.findOne({ user: doctorId });
  const patient = await Patient.findOne({ nic }).populate({
    path: "prescriptions",
    match: {
      doctor: userType === "doctor" ? doctor?._id : doctorId,
    },
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
  console.log(patient, "patient");
  let res: any = [];
  if (place === "dashboard") {
    patient.prescriptions.forEach((prescription: any) => {
      res.push({
        _id: prescription._id,
        date: formatDate(prescription.createdAt),
        doctor: prescription.doctor.user.name,
      });
    });
    return Response.json({ data: res });
  }

  patient.prescriptions.forEach((prescription: any) => {
    res.push({
      _id: prescription._id,
      date: formatDate(prescription.createdAt),
      doctor: prescription.doctor.user.name,
      valid: formatDate(prescription.validTill),
      notes: prescription.doctorNotes,
      disease: prescription.disease,
      medicine: prescription.medicine,
      hospital: prescription.hospital,
    });
  });

  return Response.json({ data: res });
});
