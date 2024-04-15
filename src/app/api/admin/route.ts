import { auth } from "@/auth";
import { Doctor } from "@/models/doctor";
import { Laboratory } from "@/models/laboratory";
import { Patient } from "@/models/patient";
import { Pharmacist } from "@/models/pharmacist";

export const GET = auth(async (req) => {
  console.log("GET /api/admin/dashboard");
  try {
    const totalPatientCount = await Patient.countDocuments();
    const totalDoctorCount = await Doctor.countDocuments();
    const totalPharmacistCount = await Pharmacist.countDocuments();
    const totalLaboratoryCount = await Laboratory.countDocuments();

    const data = {
      totalPatientCount,
      totalDoctorCount,
      totalPharmacistCount,
      totalLaboratoryCount,
    };
    console.log(data, "data");

    return Response.json({ data: data });
  } catch (error) {
    return Response.json({ error: "Something went wrong" });
  }
});
