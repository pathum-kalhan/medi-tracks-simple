import { auth } from "@/auth";
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

  let res: any = [];
  if (place === "dashboard") {
    patient.surgeries.forEach((surgeries: any) => {
      res.push({
        _id: surgeries._id,
        date: surgeries.createdAt,
        doctor: surgeries.doctor.user.name,
      });
    });
    return Response.json({ data: res });
  }

  console.log(patient.surgeries, "surgery");
  patient.surgeries.forEach((surgeries: any) => {
    res.push({
      _id: surgeries._id,
      date: surgeries.createdAt,
      doctor: surgeries.doctor.user.name,
      valid: surgeries.validTill,
      notes: surgeries.doctorNotes,
      medicine: surgeries.medicine,
      hospital: surgeries.hospital,
    });
  });

  return Response.json({ data: res });
});
