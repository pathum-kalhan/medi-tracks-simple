"use client";
import FormProvider from "@/Forms/FormProvider";
import RHFTextField from "@/Forms/RHFTextField";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType, z } from "zod";
import { changePassword } from "@/app/actions/password";
import { useFormState } from "react-dom";
import toast, { Toaster } from "react-hot-toast";

type FormValue = {
  oldPassword: string;
  newPassword: string;
};

const initialState = {
  message: "idle",
  error: null,
};

export default function Home() {
  const [state, formAction] = useFormState(changePassword, initialState);
  const defaultValues = {
    oldPassword: "",
    newPassword: "",
  };
  const schema: ZodType<FormValue> = z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
  });
  const methods = useForm<FormValue>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  if (state.message === "Password updated") {
    toast.success("Password update successfully!");
  }

  if (state.message === "Old password is incorrect") {
    toast.error(
      "Entered old password is incorrect please check and try again!"
    );
  }
  console.log(state);

  return (
    <form action={formAction}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          color: "text.primary",
          borderRadius: 1,
          p: 3,
        }}
      >
        <Stack spacing={2}>
          <TextField
            name="oldPassword"
            label="Old Password"
            type="password"
            error={state?.errors?.oldPassword ? true : false}
            helperText={state?.errors?.oldPassword}
          />
          <TextField
            name="newPassword"
            label="New Password"
            type="password"
            error={state?.errors?.newPassword ? true : false}
            helperText={state?.errors?.newPassword}
          />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Stack>
        <Toaster />
      </Box>
    </form>
  );
}
