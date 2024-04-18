import { auth } from "@/auth";
import { Patient } from "@/models/patient";
import sgMail from "@sendgrid/mail";

export const POST = auth(async (req) => {
  if (req?.auth?.user.type != "doctor") {
    return Response.json({ status: "error", message: "Unauthorized" });
  }
  const body = await req.json();
  const { nic, otp, doctor } = body;

  try {
    const patient = await Patient.findOne({ nic }).populate({ path: "user" });
    if (!patient) {
      return Response.json({ status: "error", message: "Patient not found" });
    }

    if (!patient.user) {
      return Response.json({
        status: "error",
        message: "Patient doesn't have an account",
      });
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

    const msg = {
      to: patient?.user?.email,
      from: "sasiruravihansa@outlook.com",
      subject:
        "Your doctor is requesting permission to view your medical records",
      html: `<h1>Hi, ${patient?.user?.name}!</h1>
    <p>
        Your doctor ${doctor}, is requesting permission to view your medical records. Please send the following OTP to your doctor.
    </p>
    <h2>${otp}</h2>
    <p>
     If your doctor didn't request permission to view your medical records, please ignore this email.
    </p>`,
    };

    const response = await sgMail.send(msg);
  } catch (error) {
    return Response.json({ status: "error", message: "error" });
  }
});
