"use server";
import { connect } from "@/lib/mongo";
import { User } from "@/models/user";
import { z } from "zod";
import { Resend } from "resend";
import { PasswordForgotEmailTemplate } from "@/components/common/forgot-password email";

export type State = {
  status: "success" | "error";
  message: string;
  errors?: {
    email?: string[];
  };
} | null;

const formSchema = z.object({
  email: z
    .string({
      required_error: "required field",
      invalid_type_error: "Email is required",
    })
    .email({ message: "Invalid email" })
    .transform((val) => val.toLowerCase()),
});

export async function PasswordForget(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  const validationResult = formSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validationResult.success) {
    return {
      status: "error",
      message: "Please enter a valid email address",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  await connect();
  const { email } = validationResult.data;
  const user = await User.findOne({ email });
  if (!user) {
    return { status: "error", message: "There is no account with this email" };
  }
  const resend = new Resend(process.env.RESENT_API_KEY);
  try {
    const data = await resend.emails.send({
      from: "Acme <developers.eis@gmail.com>",
      to: [`${user.name} <${email}>`],
      subject: "Hello world",
      html: "<h1>Hello world</h1>",
      react: PasswordForgotEmailTemplate({ name: user.name, OTP: 123456 }),
    });

    console.log(data);

    return { status: "success", message: "Email sent successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to send email" };
  }
}
