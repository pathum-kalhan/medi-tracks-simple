"use client";

import {
  Button,
  Card,
  Link as MUILink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { useFormState } from "react-dom";
import { doctor, State } from "@/actions/register/doctor";
import { FormEvent, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";

export default function Home() {
  const [state, dispatch] = useFormState<State, FormData>(doctor, null);
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
    <main>
      <form action={dispatch} onSubmit={handleSubmit}>
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
            Doctor Register
          </Typography>
          <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
            <TextField
              name="name"
              label="Full Name"
              size="small"
              fullWidth
              error={state?.errors?.name ? true : false}
              helperText={state?.errors?.name}
            />
            <TextField
              name="slmcNo"
              label="SLMC No."
              size="small"
              fullWidth
              error={state?.errors?.slmcNo ? true : false}
              helperText={state?.errors?.slmcNo}
            />

            <TextField
              name="phone"
              label="Phone"
              type="number"
              size="small"
              fullWidth
              error={state?.errors?.phone ? true : false}
              helperText={state?.errors?.phone}
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              size="small"
              fullWidth
              error={state?.errors?.password ? true : false}
              helperText={state?.errors?.password}
            />
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              size="small"
              fullWidth
              error={state?.errors?.confirmPassword ? true : false}
              helperText={state?.errors?.confirmPassword}
            />
            <LoadingButton
              type="submit"
              variant="contained"
              sx={{ borderRadius: 15 }}
              loading={loading}
            >
              Register
            </LoadingButton>
            <Button
              href="/login/doctor"
              variant="contained"
              sx={{ borderRadius: 15 }}
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
