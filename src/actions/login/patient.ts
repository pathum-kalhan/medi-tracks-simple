"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export type State = {
  message?: string | null;
};

export async function logIn(prevState: State, formData: FormData) {
  try {
    const rowFormData = Object.fromEntries(formData);
    rowFormData["user"] = "patient";
    await signIn("credentials", rowFormData);
  } catch (error) {
    const err = error as AuthError;
    if (err.type === "CredentialsSignin") {
      return {
        message: "CredentialsSignin",
      };
    }
    return redirect("/dashboard");
  }
}
