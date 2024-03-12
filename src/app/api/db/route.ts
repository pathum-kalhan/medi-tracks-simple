// this used for generate data, remove it after
import { faker } from "@faker-js/faker";
import { Prescription } from "@/models/doctor";
import { Patient } from "@/models/patient";
import { Doctor } from "@/models/doctor";
import { connect } from "../../../lib/mongo";
import { NextRequest } from "next/server";

async function generateInitialData() {
  try {
    for (let i = 0; i < 100; i++) {
      const hospital = faker.company.name();
      const disease = faker.lorem.words();
      const medicine = faker.commerce.productName();
      const validTill = faker.date.future();
      const patient = "65eaf6f3cc51c4a3df063448";
      const doctor = "65eaf695cc51c4a3df06343e"; // Use as constructor
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
      const pt = await Patient.findById("65eaf6f3cc51c4a3df063448");
      pt.prescriptions.push(pr._id);
      pt.save();

      const doc = await Doctor.findById("65eaf695cc51c4a3df06343e");
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
