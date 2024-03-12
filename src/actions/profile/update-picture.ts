"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongo";
import { User } from "@/models/user";
import { utapi } from "@/server/uploadthing";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

export type State = {
  status: "success" | "error";
  message: string;
  avatar?: string;
  errors?: {
    avatar?: string[];
  };
} | null;

const formSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine(
      (value) => value.size < 1024 * 1024 * 3,
      "File size should be less than 3MB"
    )
    .array()
    .min(1, "Upload profile picture"),
});

export async function updatePicture(
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
    avatar: formData.getAll("avatar"),
  });

  if (!validationResult.success) {
    return {
      status: "error",
      message: "Please fill the form correctly",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  const { avatar } = validationResult.data;
  await connect();
  const user = await User.findById(userId);
  if (!user) {
    return { status: "error", message: "User not found" };
  }
  const isExistAvatar = user.avatar;
  if (isExistAvatar) {
    const response = await utapi.deleteFiles(isExistAvatar);
    if (!response) {
      return { status: "error", message: "File delete failed" };
    }
  }
  const response = await utapi.uploadFiles(avatar[0]);
  const url = response?.data?.url;
  if (!url) {
    return { status: "error", message: "File upload failed" };
  }
  user.avatar = url;
  await user.save();
  console.log("worked");
  return {
    status: "success",
    avatar: `${url}`,
    message: "Profile picture updated successfully",
  };
}
