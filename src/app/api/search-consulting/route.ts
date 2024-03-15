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
  let matcher;
  await connect();
  const doctor = await Doctor.findOne({ user: doctorId });

  switch (userType) {
    case "doctor":
      matcher = doctor?._id ?? doctorId;
      break;
    case "patient":
      matcher = undefined;
      break;
  }

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

  if (userType !== "patient") {
    patient.prescriptions = patient.prescriptions.filter(
      (prescription: any) => {
        return prescription.doctor._id.toString() === doctorId;
      }
    );
  }

  let res: any = [];
  if (place === "dashboard") {
    patient.prescriptions.forEach((consulting: any) => {
      res.push({
        _id: consulting._id,
        createdAt: formatDate(consulting.createdAt),
        doctor: consulting.doctor.name,
        disease: consulting.disease,
      });
    });
    return Response.json({ data: res });
  }

  patient.prescriptions.forEach((prescription: any) => {
    res.push({
      _id: prescription._id,
      createdAt: formatDate(prescription.createdAt),
      doctor: prescription.doctor.user.name,
      notes: prescription.doctorNotes,
      disease: prescription.disease,
    });
  });

  return Response.json({ data: res });
});
