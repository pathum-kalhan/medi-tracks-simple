import { auth } from "@/auth";
import { formatDate } from "@/lib/date-format";
import { Prescription } from "@/models/doctor";
import { Patient } from "@/models/patient";

export const GET = auth(async (req) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );

  const allPrescriptions = await Prescription.find({}).populate({
    path: "doctor",
    populate: { path: "user" },
  });

  const data = allPrescriptions.map((prescription, index) => {
    return {
      _id: prescription._id,
      index: index + 1,
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
