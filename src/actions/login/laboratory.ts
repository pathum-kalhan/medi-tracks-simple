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
    rowFormData["user"] = "laboratory";
    const res = await signIn("credentials", rowFormData);
    return { message: "Logged in successfully" };
  } catch (error) {
    const err = error as AuthError;
    if (err.type === "CredentialsSignin") {
      return {
        message: "Your credentials are incorrect. Please try again.",
      };
    }
    return redirect("/dashboard");
  }
}
