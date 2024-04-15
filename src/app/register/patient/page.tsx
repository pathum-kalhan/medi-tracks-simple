"use client";

import FormProvider from "@/Forms/FormProvider";
import RHFTextField from "@/Forms/RHFTextField";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  Grid,
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
import { FormEvent, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function Home() {
  const [state, dispatch] = useFormState<State, FormData>(patient, null);
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

  function Copyright(props: any) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        Medicare Pro {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Patient Sign up
        </Typography>
        <form action={dispatch} onSubmit={handleSubmit}>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Patient Name"
                  id="name"
                  autoComplete="name"
                  autoFocus
                  error={state?.errors?.name ? true : false}
                  helperText={state?.errors?.name}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="nic"
                  label="National Identity Card Number"
                  id="nic"
                  autoComplete="nic"
                  autoFocus
                  error={state?.errors?.nic ? true : false}
                  helperText={state?.errors?.nic}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  id="email"
                  autoComplete="email"
                  fullWidth
                  autoFocus
                  error={state?.errors?.email ? true : false}
                  helperText={state?.errors?.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="phone"
                  label="Contact Number"
                  type="tel"
                  id="phone"
                  autoComplete="phone"
                  autoFocus
                  error={state?.errors?.phone ? true : false}
                  helperText={state?.errors?.phone}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  autoFocus
                  error={state?.errors?.password ? true : false}
                  helperText={state?.errors?.password}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  autoFocus
                  error={state?.errors?.confirmPassword ? true : false}
                  helperText={state?.errors?.confirmPassword}
                  fullWidth
                />
              </Grid>
            </Grid>
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={loading}
            >
              Sign Up
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login/patient">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
