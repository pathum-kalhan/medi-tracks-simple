"use client";

import { Button, Card, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { Link as MUILink } from "@mui/material";

import { PasswordForget, State } from "@/actions/profile/password-forgot";
import toast from "react-hot-toast";
import { useFormState } from "react-dom";
import { FormEvent, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const userType = searchParams["user"];

  const [state, dispatch] = useFormState<State, FormData>(PasswordForget, null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.status === "success") {
      setLoading(false);
      sessionStorage.setItem("otp", state.otp as string);
      toast.success(state.message);
    }
    if (state.status === "error") {
      setLoading(false);
      toast.error(state.message);
    }
  }, [state]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    sessionStorage.setItem("email-recovery", e.currentTarget.email.value);
  };

  function generateToken() {
    const randomNum = Math.random() * 9000;
    return Math.floor(1000 + randomNum).toString();
  }

  function Copyright(props: any) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        Medicare pro {new Date().getFullYear()}
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
          Forgot Password
        </Typography>
        <Box
          component="form"
          action={dispatch}
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email"
            type="email"
            id="email"
            autoComplete="email"
            error={state?.errors?.email ? true : false}
            helperText={state?.errors?.email}
          />
          <input type="hidden" id="userType" name="userType" value={userType} />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            loading={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            Get the OTP to your email
          </LoadingButton>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
