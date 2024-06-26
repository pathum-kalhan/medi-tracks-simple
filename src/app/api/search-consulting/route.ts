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
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const userType = req.auth?.user?.type ?? type;
  const doctorId = req.auth?.user?.id ?? id;

  if (!nic) {
    return Response.json({ data: [], error: "Patient nic is required" });
  }

  await connect();
  const doctor = await Doctor.findOne({ user: doctorId });
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

  let res: any = [];
  if (place === "dashboard") {
    patient.prescriptions.forEach(
      (consulting: any, consultingIndex: number) => {
        res.push({
          _id: consulting._id,
          index: consultingIndex + 1,
          createdAt: formatDate(consulting.createdAt),
          doctor: consulting.doctor.name,
          disease: consulting.disease,
        });
      }
    );
    return Response.json({ data: res });
  }

  patient.prescriptions.forEach(
    (prescription: any, prescriptionIndex: number) => {
      res.push({
        _id: prescription._id,
        index: prescriptionIndex + 1,
        createdAt: formatDate(prescription.createdAt),
        doctor: prescription.doctor.user.name,
        notes: prescription.doctorNotes,
        hospital: prescription.hospital,
        disease: prescription.disease,
        validTill: formatDate(prescription.validTill),
      });
    }
  );

  if (startDate && endDate) {
    const filteredRes = res.filter((item: any) => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });
    res = filteredRes;
  }

  return Response.json({ data: res });
});
