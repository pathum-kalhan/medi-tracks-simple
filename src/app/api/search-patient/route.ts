import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { Patient } from "@/models/patient";
import { User } from "@/models/user";
import queryString from "query-string";

export const GET = auth(async (req) => {
  const { searchParams } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_API_URL as string
  );
  const params = queryString.parse(searchParams.toString());
  // if (!params.n) {
  //   return Response.json({ data: [], error: "NIC is required" });
  // }

  // if (
  //   !(
  //     req.auth?.user?.type === "doctor" || req.auth?.user?.type === "pharmacist"
  //   )
  // ) {
  //   return Response.json({ data: [], error: "Unauthorized" });
  // }
  let patient;
  let user: any[] = [];
  let patientData: any[] = [];
  console.log(params);
  if (params.nic) {
    patient = await Patient.findOne({ nic: params.nic }).populate("user");
    if (!patient) {
      return Response.json({ data: [], error: "Patient not found" });
    }

    if (!patient.user) {
      patientData = [
        {
          nic: patient.nic,
          name: patient.name || "n/a",
          phone: patient.mobile || "n/a",
          labReports: patient.labReports,
          prescriptions: patient.prescriptions,
        },
      ];
    }
    if (patient.user) {
      patientData = [
        {
          nic: patient.nic,
          name: patient.user.name,
          phone: patient.user.phone,
          labReports: patient.labReports,
          prescriptions: patient.prescriptions,
        },
      ];
    }
  }

  if (params.name || params.phone) {
    user = await User.find({
      name: new RegExp(params.name as string, "i"),
      phone: new RegExp(params.phone as string, "i"),
    });

    for (const u of user) {
      const p = await Patient.findOne({ user: u._id })
        .populate("user")
        .populate("labReports")
        .populate("prescriptions");

      if (p) {
        patientData.push({
          nic: p.nic,
          name: p.user.name,
          phone: p.user.phone,
          labReports: p.labReports,
          prescriptions: p.prescriptions,
        });
      }
    }
  }

  return Response.json({ data: patientData });
});
