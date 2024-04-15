import { auth } from "@/auth";
import { Doctor, Prescription, Surgery } from "@/models/doctor";

export const GET = auth(async (req) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ data: [], error: "User id is required" });
  }

  const doctor = await Doctor.findOne({ user: userId });

  const prescriptionGivenPatients = await Prescription.find({
    doctor: doctor._id,
  }).populate("patient");

  const uniquePrescriptionGivenPatients = Array.from(
    new Set(prescriptionGivenPatients?.map((p) => p.patient._id))
  ).map((id) => prescriptionGivenPatients.find((p) => p.patient._id === id));

  const surgeryGivenPatients = await Surgery.find({
    doctor: doctor._id,
  }).populate("patient");
  const uniqueSurgeryGivenPatients = Array.from(
    new Set(surgeryGivenPatients.map((p) => p.patient._id))
  ).map((id) => surgeryGivenPatients.find((p) => p.patient._id === id));

  const allPatients = [
    ...uniquePrescriptionGivenPatients,
    ...uniqueSurgeryGivenPatients,
  ];

  let uniquePatients: { [key: string]: boolean } = {};

  allPatients.forEach((pt) => {
    if (pt && !uniquePatients[pt.patient._id]) {
      uniquePatients[pt.patient._id] = true;
    }
  });

  const data = [
    { left: "SLMC number", right: doctor?.slmcNo },
    {
      left: "Number of treated patients",
      right: Object.keys(uniquePatients).length,
    },
  ];

  return Response.json({ data });
});
