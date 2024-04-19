import { auth } from "@/auth";
import { formatDate } from "@/lib/date-format";
import { Prescription, Surgery } from "@/models/doctor";
import { Patient } from "@/models/patient";
import { User } from "@/models/user";

export const GET = auth(async (req) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const nic = searchParams.get("nic");

  if (!nic) {
    return Response.json({ data: [], error: "NIC id is required" });
  }

  const patient = await Patient.findOne({ nic: nic }).populate({
    path: "user",
    model: User,
    select: "name",
  });
  const prescription = await Prescription.find({
    patient: patient?._id,
  }).populate({
    path: "doctor",
    populate: { path: "user" },
  });

  const surgeries = await Surgery.find({
    patient: patient?._id,
  }).populate({
    path: "doctor",
    populate: { path: "user" },
  });

  const prescriptionData = prescription.map((prescription, index) => {
    return {
      _id: prescription._id,
      type: "prescription",
      date: formatDate(prescription.createdAt),
      valid: formatDate(prescription.validTill),
      doctor: prescription.doctor.user.name,
      medicine: prescription.medicine,
      disease: prescription.disease,
      hospital: prescription.hospital,
      notes: prescription.doctorNotes,
      isIssued: prescription.isIssued,
      issuedRange: prescription.issuedRange,
    };
  });

  const surgeryData = surgeries.map((surgery, index) => {
    return {
      _id: surgery._id,
      type: "surgery",
      date: formatDate(surgery.createdAt),
      valid: formatDate(surgery.validTill),
      doctor: surgery.doctor.user.name,
      medicine: surgery.medicine,
      disease: surgery.surgeryName,
      hospital: surgery.hospital,
      notes: surgery.notes,
      isIssued: surgery.isIssued,
      issuedRange: surgery.issuedRange,
    };
  });

  const data = [...prescriptionData, ...surgeryData]
    .sort((b, a) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((item, index) => {
      return { ...item, index: index + 1 };
    });

  return Response.json({ data: data, name: patient?.user?.name || "n/a" });
});
