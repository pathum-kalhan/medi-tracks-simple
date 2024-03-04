"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { User } from "@/models/user";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

export type State = {
  status: "success" | "error";
  message: string;
  errors?: {
    oldPassword?: string[];
    newPassword?: string[];
  };
} | null;

const formSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export async function updatePassword(
  _prevState: State | null,
  formData: FormData
): Promise<State> {
  const session = await auth();
  if (!session) {
    return { status: "error", message: "Please login first" };
  }
  const userId = session.user?.id;
  if (!userId) {
    return { status: "error", message: "Please login first" };
  }
  const validationResult = formSchema.safeParse({
    oldPassword: formData.get("oldPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!validationResult.success) {
    return {
      status: "error",
      message: "Please fill the form correctly",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  const { oldPassword, newPassword } = validationResult.data;
  await connect();
  const user = await User.findById(userId);
  if (!user) {
    return { status: "error", message: "User not found" };
  }
  const isPasswordMatch = await compare(oldPassword as string, user.password);
  if (!isPasswordMatch) {
    return { status: "error", message: "Old password is incorrect" };
  }
  const hashedPassword = await hash(newPassword as string, 10);
  user.password = hashedPassword;
  await user.save();
  return { status: "success", message: "Password updated successfully" };
}
