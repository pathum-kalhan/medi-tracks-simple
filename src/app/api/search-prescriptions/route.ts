import { auth } from "@/auth";
import { formatDate } from "@/lib/date-format";
import { connect } from "@/lib/mongo";
import { Doctor, Prescription } from "@/models/doctor";
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
  const disease = searchParams.get("disease");

  const userType = req.auth?.user?.type ?? type;
  const doctorId = req.auth?.user?.id ?? id;

  if (!nic) {
    return Response.json({ data: [], error: "Patient nic is required" });
  }

  await connect();
  const doctor = await Doctor.findOne({ user: doctorId });

  if (!doctor && userType === "doctor") {
    const prescription = await Prescription.find({}).populate({
      path: "doctor",
      model: Doctor,
      populate: {
        path: "user",
        model: User,
      },
    });

    let res: any = [];
    if (place === "dashboard") {
      prescription.forEach((prescription: any) => {
        res.push({
          _id: prescription._id,
          date: formatDate(prescription.createdAt),
          doctor: prescription.doctor.user.name,
        });
      });
    }
    return Response.json({ data: res });
  }

  const patient = await Patient.findOne({ nic })
    .populate({
      path: "prescriptions",
      populate: [
        {
          path: "doctor",
          model: Doctor,
          populate: {
            path: "user",
            model: User,
          },
        },
      ],
    })
    .populate({
      path: "surgeries",
      populate: [
        {
          path: "doctor",
          model: Doctor,
          populate: {
            path: "user",
            model: User,
          },
        },
      ],
    });
  if (!patient) {
    return Response.json({ data: [], error: "Patient not found" });
  }

  let res: any = [];
  if (place === "dashboard") {
    patient.prescriptions.forEach(
      (prescription: any, prescriptionIndex: number) => {
        res.push({
          _id: prescription._id,
          createdAt: formatDate(prescription.createdAt),
          doctor: prescription.doctor.user.name,
          medicine: prescription.medicine,
        });
      }
    );

    patient.surgeries.forEach((surgery: any, surgeryIndex: number) => {
      res.push({
        _id: surgery._id,
        createdAt: formatDate(surgery.createdAt),
        doctor: surgery.doctor.user.name,
        medicine: surgery.medicine,
      });
    });

    res = res.map((row: any, index: number) => ({
      ...row,
      index: index + 1,
    }));

    return Response.json({ data: res });
  }

  patient.prescriptions.forEach(
    (prescription: any, prescriptionIndex: number) => {
      res.push({
        _id: prescription._id,
        type: "prescription",
        date: formatDate(prescription.createdAt),
        doctor: prescription.doctor.user.name,
        valid: formatDate(prescription.validTill),
        notes: prescription.doctorNotes,
        disease: prescription.disease,
        medicine: prescription.medicine,
        hospital: prescription.hospital,
        location: prescription.doctor,
        isIssued: prescription.isIssued,
        issuedRange: prescription.issuedRange,
      });
    }
  );

  patient.surgeries.forEach((surgery: any, surgeryIndex: number) => {
    res.push({
      _id: surgery._id,
      type: "surgery",
      date: formatDate(surgery.createdAt),
      doctor: surgery.doctor.user.name,
      valid: formatDate(surgery.validTill),
      notes: surgery.doctorNotes,
      disease: surgery.surgeryName,
      medicine: surgery.medicine,
      hospital: surgery.hospital,
      location: surgery.doctor,
      isIssued: surgery.isIssued,
      issuedRange: surgery.issuedRange,
    });
  });

  res = res.map((row: any, index: number) => ({
    ...row,
    index: index + 1,
  }));

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    res = res.filter((row: any) => {
      const rowDate = new Date(row.date);
      return rowDate >= start && rowDate <= end;
    });
  }

  if (disease) {
    console.log(res, "disease");
    res = res.filter((row: any) => row.disease.includes(disease));
  }

  return Response.json({ data: res });
});
