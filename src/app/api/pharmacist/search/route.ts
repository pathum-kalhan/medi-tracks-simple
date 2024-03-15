import { auth } from "@/auth";
import { formatDate } from "@/lib/date-format";
import { Prescription } from "@/models/doctor";
import { Patient } from "@/models/patient";

export const GET = auth(async (req) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const nic = searchParams.get("nic");

  if (!nic) {
    return Response.json({ data: [], error: "NIC id is required" });
  }

  const patient = await Patient.findOne({ nic: nic });
  const prescription = await Prescription.find({
    patient: patient?._id,
  }).populate({
    path: "doctor",
    populate: { path: "user" },
  });

  const data = prescription.map((prescription) => {
    return {
      _id: prescription._id,
      date: formatDate(prescription.createdAt),
      valid: formatDate(prescription.validTill),
      doctor: prescription.doctor.user.name,
      medicine: prescription.medicine,
      disease: prescription.disease,
      hospital: prescription.hospital,
      notes: prescription.doctorNotes,
    };
  });

  return Response.json({ data });
});
