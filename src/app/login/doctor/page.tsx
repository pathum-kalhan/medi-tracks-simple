"use client";

import { Button, Card, Stack, TextField, Typography } from "@mui/material";
import { useFormState } from "react-dom";
import Link from "next/link";
import { Link as MUILink } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { logIn, State } from "@/actions/login/doctor";
import toast from "react-hot-toast";
import { FormEvent, useEffect, useState } from "react";

export default function Page() {
  const [state, dispatch] = useFormState<State, FormData>(logIn, null);
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
      <Card
        sx={{
          top: "50%",
          left: "50%",
          position: "absolute",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 577,
          maxHeight: 546,
          margin: "0 auto",
          padding: 4,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography
          align="center"
          variant="h3"
          sx={{
            mb: 4,
          }}
        >
          Doctor Login
        </Typography>
        <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
          <TextField
            name="slmcNo"
            label="SLMC"
            type="text"
            size="small"
            error={state?.errors?.slmcNo ? true : false}
            helperText={state?.errors?.slmcNo}
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
          <MUILink href={`/register/doctor`} component={Link}>
            Register as a new doctor
          </MUILink>
          <LoadingButton
            type="submit"
            variant="contained"
            sx={{ borderRadius: 15 }}
            loading={loading}
          >
            Login
          </LoadingButton>
        </Stack>
        <Stack spacing={1} sx={{ alignItems: "center" }}>
          <MUILink href="/login/patient" component={Link}>
            Login as a patient
          </MUILink>

          <MUILink href="/login/laboratory" component={Link}>
            Login as a laboratory
          </MUILink>

          <MUILink href="/login/pharmacist" component={Link}>
            Login as a pharmacy
          </MUILink>
        </Stack>
      </Card>
    </form>
  );
}
