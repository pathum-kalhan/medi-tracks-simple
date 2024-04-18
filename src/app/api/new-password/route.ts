import { auth } from "@/auth";
import { User } from "@/models/user";
import { hash } from "bcryptjs";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { password, email } = body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        status: "error",
        message: "There is no account with this email",
      };
    }
    const hashedPassword = await hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    return { status: "success", message: "Password updated successfully" };
  } catch (error) {
    return { status: "error", message: "Something went wrong" };
  }
};
