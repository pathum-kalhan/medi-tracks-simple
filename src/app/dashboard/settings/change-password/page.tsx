"use client";

import RHFTextField from "@/Forms/RHFTextField";
import { Box, Button, Stack, TextField } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType, z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { updatePassword, State } from "@/actions/profile/update-password";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";

type FormValue = {
  oldPassword: string;
  newPassword: string;
};

export default function Home() {
  const [state, dispatch] = useFormState<State, FormData>(updatePassword, null);

  return (
    <form action={dispatch}>
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
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Stack>
        <Toaster />
      </Box>
    </form>
  );
}
