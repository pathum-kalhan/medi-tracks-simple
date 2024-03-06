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
import { pharmacist, State } from "@/actions/register/pharmacist";
import { useEffect } from "react";

export default function Home() {
  const [state, dispatch] = useFormState<State, FormData>(pharmacist, null);

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
            maxHeight: 1000,
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
            Pharmacy Register
          </Typography>
          <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
            <TextField
              name="name"
              label="Pharmacy Name"
              size="small"
              error={state?.errors?.name ? true : false}
              helperText={state?.errors?.name}
              fullWidth
            />
            <TextField
              name="regNo"
              label="Pharmacy Registration Number"
              size="small"
              error={state?.errors?.regNo ? true : false}
              helperText={state?.errors?.regNo}
              fullWidth
            />
            <TextField
              name="location"
              label="Pharmacy Location"
              size="small"
              error={state?.errors?.location ? true : false}
              helperText={state?.errors?.location}
              fullWidth
            />
            <TextField
              name="phone"
              label="Contact Number"
              type="number"
              size="small"
              error={state?.errors?.phone ? true : false}
              helperText={state?.errors?.phone}
              fullWidth
            />

            <TextField
              name="email"
              label="Email"
              type="email"
              size="small"
              error={state?.errors?.email ? true : false}
              helperText={state?.errors?.email}
              fullWidth
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              size="small"
              error={state?.errors?.password ? true : false}
              helperText={state?.errors?.password}
              fullWidth
            />
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              size="small"
              error={state?.errors?.confirmPassword ? true : false}
              helperText={state?.errors?.confirmPassword}
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
