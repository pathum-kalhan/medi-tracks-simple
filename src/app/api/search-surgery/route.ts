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

  if (userType != "patient") {
    patient.surgeries = patient.surgeries.filter(
      (surgery: any) => surgery.doctor._id.toString() == doctor._id
    );
  }

  let res: any = [];
  if (place === "dashboard") {
    patient.surgeries.forEach((surgeries: any, surgeryIndex: number) => {
      res.push({
        _id: surgeries._id,
        index: surgeryIndex + 1,
        createdAt: formatDate(surgeries.createdAt),
        doctor: surgeries.doctor.user.name,
      });
    });
    return Response.json({ data: res });
  }

  console.log(patient.surgeries, "surgery");
  patient.surgeries.forEach((surgeries: any, surgeryIndex: number) => {
    res.push({
      _id: surgeries._id,
      index: surgeryIndex + 1,
      date: formatDate(surgeries.createdAt),
      doctor: surgeries.doctor.user.name,
      valid: formatDate(surgeries.validTill),
      notes: surgeries.doctorNotes,
      medicine: surgeries.medicine,
      hospital: surgeries.hospital,
    });
  });

  return Response.json({ data: res });
});
