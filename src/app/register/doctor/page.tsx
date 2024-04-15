"use client";

import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

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
          Doctor Sign up
        </Typography>
        <form action={dispatch} onSubmit={handleSubmit}>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Full Name"
                  id="name"
                  autoComplete="name"
                  fullWidth
                  autoFocus
                  error={state?.errors?.name ? true : false}
                  helperText={state?.errors?.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="slmcNo"
                  label="SLMC No."
                  id="slmcNo"
                  autoComplete="slmcNo"
                  fullWidth
                  autoFocus
                  error={state?.errors?.slmcNo ? true : false}
                  helperText={state?.errors?.slmcNo}
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
                  label="Phone"
                  type="number"
                  id="phone"
                  autoComplete="phone"
                  fullWidth
                  autoFocus
                  error={state?.errors?.phone ? true : false}
                  helperText={state?.errors?.phone}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  fullWidth
                  autoFocus
                  error={state?.errors?.password ? true : false}
                  helperText={state?.errors?.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  fullWidth
                  autoFocus
                  error={state?.errors?.confirmPassword ? true : false}
                  helperText={state?.errors?.confirmPassword}
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
                <Link href="/login/doctor" variant="body2">
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
