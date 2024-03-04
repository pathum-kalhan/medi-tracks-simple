"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { User } from "@/models/user";
import { compare, hash } from "bcryptjs";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export type State = {
  status: "success" | "error";
  message: string;
  errors?: {
    name?: string[];
    phone?: string[];
  };
} | null;

const formSchema = z.object({
  name: z
    .string({
      required_error: "required field",
      invalid_type_error: "Name is required",
    })
    .min(3, "Name must be at least 3 characters"),
  phone: z
    .string({
      required_error: "required field",
      invalid_type_error: "Mobile number is required",
    })
    .refine(
      (value) => /^(?:\d{9})$/.test(value),
      "Please enter a valid mobile number ex: 771234568"
    )
    .transform((data) => Number(data)),
});

export async function updateProfile(
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
    name: formData.get("name"),
    phone: formData.get("phone"),
  });

  if (!validationResult.success) {
    return {
      status: "error",
      message: "Please fill the form correctly",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  const { name, phone } = validationResult.data;
  await connect();
  const user = await User.findById(userId);
  if (!user) {
    return { status: "error", message: "User not found" };
  }
  user.name = name;
  user.phone = phone;
  await user.save();
  revalidateTag("profile");
  return { status: "success", message: "Profile updated successfully" };
}
