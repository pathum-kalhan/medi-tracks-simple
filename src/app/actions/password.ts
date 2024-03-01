"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { compare, hash } from "bcryptjs";
import { Doctor } from "@/models/doctor";
import { connect } from "@/lib/db";
import { User } from "@/models/user";

export type PasswordChangeFormState = {
  errors?: {
    oldPassword?: string[];
    newPassword?: string[];
  };
  message?: string;
};

const PasswordFormSchema = z
  .object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
  })
  .required();

async function CheckUser(userType, id) {
  console.log(userType, id, "userType, id, doctor");
  switch (userType) {
    case "doctor":
      const doctor = await Doctor.findById(id);
      const user = await User.findById(doctor?.user);
      return user;
  }
}

export async function changePassword(
  _prevState: PasswordChangeFormState,
  formData: FormData
): Promise<PasswordChangeFormState> {
  const session = await auth();
  if (!session) {
    return {
      message: "Unauthorized",
    };
  }
  const validatedFields = PasswordFormSchema.safeParse({
    oldPassword: formData.get("oldPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields",
    };
  } else {
    //get the user

    console.log(session?.user?.type, session?.user?.id, "session");
    const user = await CheckUser(session?.user?.type, session?.user?.id);
    console.log(user, "user");
    //check old password correct
    const isOldPasswordCorrect = await compare(
      validatedFields.data.oldPassword,
      user?.password
    );
    if (!isOldPasswordCorrect) {
      return {
        message: "Old password is incorrect",
      };
    }

    const hashedNewPassword = await hash(validatedFields.data.newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();
    console.log("Password updated");
    return {
      message: "Password updated",
    };
  }
}

export type UserChangeFormState = {
  errors?: {
    name?: string[];
    phone?: string[];
  };
  message?: string;
};

const UserFormSchema = z
  .object({
    name: z.string().min(6),
    phone: z.string().min(10),
  })
  .required();

export async function updateProfile(
  _prevState: UserChangeFormState,
  formData: FormData
): Promise<UserChangeFormState> {
  const session = await auth();
  if (!session) {
    return {
      message: "Unauthorized",
    };
  }
  const validatedFields = UserFormSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields",
    };
  } else {
    //get the user

    console.log(session?.user?.type, session?.user?.id, "session");
    const user = await CheckUser(session?.user?.type, session?.user?.id);
    console.log(user, "user");
  }
  return {
    message: "Profile updated",
  };
}
