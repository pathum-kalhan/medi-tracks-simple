// this used for generate data, remove it after
import { faker } from "@faker-js/faker";
import { Prescription } from "@/models/doctor";
import { Patient } from "@/models/patient";
import { Doctor } from "@/models/doctor";
import { connect } from "../../../lib/mongo";
import { NextRequest } from "next/server";

async function generateInitialData() {
  try {
    for (let i = 0; i < 10; i++) {
      const hospital = faker.company.name();
      const disease = faker.lorem.words();
      const medicine = faker.commerce.productName();
      const validTill = faker.date.future();
      const patient = "65eff3b0fb3a39d135b3e500";
      const doctor = "65efef05fb3a39d135b3e4ee"; // Use as constructor
      const doctorNotes = faker.lorem.sentence();
      await connect();
      const pr = await Prescription.create({
        hospital,
        disease,
        medicine,
        validTill,
        patient,
        doctor,
        doctorNotes,
      });
      const pt = await Patient.findById("65eff3b0fb3a39d135b3e500");
      pt.prescriptions.push(pr._id);
      pt.save();

      const doc = await Doctor.findById("65efef05fb3a39d135b3e4ee");
      doc.prescriptions.push(pr._id);
      doc.save();
    }
    console.log("Initial data generated successfully!");
  } catch (error) {
    console.error("Error generating initial data:", error);
  }
}
export const POST = async (req: NextRequest) => {
  generateInitialData();
  return Response.json({ message: "Initial data generation started" });
};
