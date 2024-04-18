"use client";

import { Button, Card, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { Link as MUILink } from "@mui/material";

import { logIn, State } from "@/actions/login/doctor";
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
import { useRouter } from "next/navigation";

export default function Page() {
  const { push } = useRouter();

  const [state, dispatch] = useFormState<State, FormData>(logIn, null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.status === "success") {
      setLoading(false);
      push("/new-password");
      toast.success(state.message);
    }
    if (state.status === "error") {
      setLoading(false);
      toast.error(state.message);
    }
  }, [state, push]);

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
          Doctor Sign in
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
            id="slmcNo"
            label="SLMC Number"
            name="slmcNo"
            autoComplete="slmcNo"
            autoFocus
            error={state?.errors?.slmcNo ? true : false}
            helperText={state?.errors?.slmcNo}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={state?.errors?.password ? true : false}
            helperText={state?.errors?.password}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            loading={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </LoadingButton>
          <Grid container>
            <Grid item>
              <MUILink href="/forgot-password?user=doctor" component={Link}>
                {"Forgot password?"}
              </MUILink>
            </Grid>
            <Grid item>
              <MUILink href="/register/doctor" component={Link}>
                {"Don't have an account? Sign Up"}
              </MUILink>
            </Grid>
          </Grid>
        </Box>
        <Stack spacing={1} marginTop={2} sx={{ alignItems: "center" }}>
          <Button href="/login/patient" variant="contained">
            {"Login as a patient"}
          </Button>
          <Button href="/login/laboratory" variant="contained">
            {"Login as a laboratorian"}
          </Button>
          <Button href="/login/pharmacist" variant="contained">
            {"Login as pharmacist"}
          </Button>
        </Stack>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
