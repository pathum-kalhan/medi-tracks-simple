"use server";
import { connect } from "@/lib/mongo";
import { User } from "@/models/user";
import { z } from "zod";
import sgMail from "@sendgrid/mail";
import { PasswordForgotEmailTemplate } from "@/components/common/forgot-password email";
import { Doctor } from "@/models/doctor";
import { Patient } from "@/models/patient";
import { Pharmacist } from "@/models/pharmacist";
import { Laboratory } from "@/models/laboratory";

export type State = {
  status: "success" | "error";
  message: string;
  errors?: {
    email?: string[];
  };
  otp?: string;
} | null;

function generateToken() {
  const randomNum = Math.random() * 9000;
  return Math.floor(100000 + randomNum).toString();
}

const formSchema = z.object({
  email: z
    .string({
      required_error: "required field",
      invalid_type_error: "Email is required",
    })
    .email({ message: "Invalid email" })
    .transform((val) => val.toLowerCase()),
  userType: z.enum(["doctor", "patient", "pharmacist", "laboratory"]),
});

export async function PasswordForget(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  const validationResult = formSchema.safeParse({
    email: formData.get("email"),
    userType: formData.get("userType"),
  });

  if (!validationResult.success) {
    return {
      status: "error",
      message: "Please enter a valid email address",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  await connect();
  const { email, userType } = validationResult.data;
  const user = await User.findOne({ email });
  let isAccount;
  if (userType === "doctor") {
    isAccount = await Doctor.findOne({ user: user?._id });
  }
  if (userType === "patient") {
    isAccount = await Patient.findOne({ user: user?._id });
  }
  if (userType === "pharmacist") {
    isAccount = await Pharmacist.findOne({ user: user?._id });
  }
  if (userType === "laboratory") {
    isAccount = await Laboratory.findOne({ user: user?._id });
  }
  if (!user || !isAccount) {
    return {
      status: "error",
      message: "There is no account with this email",
    };
  }
  if (user && !isAccount) {
    return {
      status: "error",
      message: "There is no account with this email",
    };
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  const OTP = generateToken();
  const msg = {
    to: email,
    from: "sasiruravihansa@outlook.com",
    subject: "Password Reset",
    html: `<h1>Welcome, ${user?.name}!</h1>
    <p>
      You are one step away from resetting your password. Please use the OTP
      below to reset your password.
    </p>
    <h2>${OTP}</h2>
    <p>
      If you did not request a password reset, please ignore this email or
      contact us.
    </p>`,
  };
  try {
    const response = await sgMail.send(msg);

    console.log(response);
    return { status: "success", message: "Email sent successfully", otp: OTP };
  } catch (error) {
    console.log(error);
    return { status: "error", message: "Failed to send email" };
  }
}
