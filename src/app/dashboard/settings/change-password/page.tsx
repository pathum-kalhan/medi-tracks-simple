"use client";

import RHFTextField from "@/Forms/RHFTextField";
import { Box, Button, Stack, TextField } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType, z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { updatePassword, State } from "@/actions/profile/update-password";
import { useFormState } from "react-dom";
import { FormEvent, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";

type FormValue = {
  oldPassword: string;
  newPassword: string;
};

export default function Home() {
  const [state, dispatch] = useFormState<State, FormData>(updatePassword, null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.status === "success") {
      setLoading(false);
      toast.success(state.message);
    }
    if (state.status === "error") {
      setLoading(false);
      toast.error(state.message);
    }
  }, [state]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
  };

  return (
    <form action={dispatch} onSubmit={handleSubmit}>
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
            size="small"
            error={state?.errors?.oldPassword ? true : false}
            helperText={state?.errors?.oldPassword}
          />
          <TextField
            name="newPassword"
            label="New Password"
            type="password"
            size="small"
            error={state?.errors?.newPassword ? true : false}
            helperText={state?.errors?.newPassword}
          />
          <LoadingButton type="submit" variant="contained" loading={loading}>
            Update Password
          </LoadingButton>
        </Stack>
        <Toaster />
      </Box>
    </form>
  );
}
