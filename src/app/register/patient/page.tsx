"use client";

import FormProvider from "@/Forms/FormProvider";
import RHFTextField from "@/Forms/RHFTextField";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Card,
  Link as MUILink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useFormState } from "react-dom";
import { patient, State } from "@/actions/register/patient";
import { useEffect } from "react";

export default function Home() {
  const [state, dispatch] = useFormState<State, FormData>(patient, null);

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.status === "success") {
      toast.success(state.message);
    }
    if (state.status === "error") {
      toast.error(state.message);
    }
  });

  return (
    <main>
      <form action={dispatch}>
        <Card
          sx={{
            top: "50%",
            left: "50%",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 505,
            maxHeight: 732,
            margin: "0 auto",
            padding: 4,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 1)",
          }}
        >
          <Typography
            align="center"
            variant="h3"
            sx={{
              mb: 4,
            }}
          >
            Patients Register
          </Typography>
          <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
            <TextField
              name="name"
              label="Patient Name"
              size="small"
              error={state?.errors?.name ? true : false}
              helperText={state?.errors?.name ? state.errors.name[0] : ""}
              fullWidth
            />
            <TextField
              name="nic"
              label="NIC"
              size="small"
              error={state?.errors?.nic ? true : false}
              helperText={state?.errors?.nic ? state.errors.nic[0] : ""}
              fullWidth
            />

            <TextField
              name="phone"
              label="Mobile Number"
              type="number"
              size="small"
              error={state?.errors?.phone ? true : false}
              helperText={state?.errors?.phone ? state.errors.phone[0] : ""}
              fullWidth
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              size="small"
              error={state?.errors?.password ? true : false}
              helperText={
                state?.errors?.password ? state.errors.password[0] : ""
              }
              fullWidth
            />
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              size="small"
              error={state?.errors?.confirmPassword ? true : false}
              helperText={
                state?.errors?.confirmPassword
                  ? state.errors.confirmPassword[0]
                  : ""
              }
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{ borderRadius: 20 }}
            >
              Register
            </Button>
            <Button
              href="/login/patient"
              variant="contained"
              fullWidth
              style={{ borderRadius: 20 }}
            >
              Have an account? Sign in
            </Button>
          </Stack>
        </Card>
      </form>
      <Toaster />
    </main>
  );
}
