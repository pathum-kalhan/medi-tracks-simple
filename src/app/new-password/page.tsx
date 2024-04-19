"use client";

import {
  Box,
  Button,
  Card,
  FormHelperText,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { Link as MUILink } from "@mui/material";
import toast from "react-hot-toast";
import { useFormState } from "react-dom";
import { FormEvent, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import RHFTextField from "@/Forms/RHFTextField";
import { z } from "zod";
import RHFCodes from "@/Forms/RHFCodes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormProvider from "@/Forms/FormProvider";
import Iconify from "@/components/iconify";
import { useRouter } from "next/navigation";

export default function Page() {
  const { push } = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const email =
    typeof window !== "undefined"
      ? sessionStorage.getItem("email-recovery")
      : "";
  const OTP =
    typeof window !== "undefined" ? sessionStorage.getItem("otp") : "";

  const VerifyCodeSchema = z
    .object({
      code1: z.string().min(1, { message: "Code is required" }),
      code2: z.string().min(1, { message: "Code is required" }),
      code3: z.string().min(1, { message: "Code is required" }),
      code4: z.string().min(1, { message: "Code is required" }),
      code5: z.string().min(1, { message: "Code is required" }),
      code6: z.string().min(1, { message: "Code is required" }),
      password: z
        .string({
          required_error: "required field",
          invalid_type_error: "Password is required",
        })
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string({
        required_error: "required field",
        invalid_type_error: "Confirm Password is required",
      }),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
          path: ["confirmPassword"],
        });
      }
    });

  const defaultValues = {
    code1: "",
    code2: "",
    code3: "",
    code4: "",
    code5: "",
    code6: "",
    password: "",
    confirmPassword: "",
  };

  const methods = useForm({
    mode: "onChange",
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      if (
        data.code1 +
          data.code2 +
          data.code3 +
          data.code4 +
          data.code5 +
          data.code6 !==
        OTP
      ) {
        toast.error("Invalid code OTP code");
        return;
      }
      const req = {
        email,
        password: data.password,
      };
      const response = await fetch("/api/new-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });
      toast.success("Password updated successfully");
      push("/login/patient");
    } catch (error) {
      toast.error("Something went wrong");
    }
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
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
          <Stack spacing={3}>
            <RHFCodes
              keyName="code"
              inputs={["code1", "code2", "code3", "code4", "code5", "code6"]}
            />

            {(!!errors.code1 ||
              !!errors.code2 ||
              !!errors.code3 ||
              !!errors.code4 ||
              !!errors.code5 ||
              !!errors.code6) && (
              <FormHelperText error sx={{ px: 2 }}>
                Code is required
              </FormHelperText>
            )}

            <RHFTextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="confirmPassword"
              label="Confirm New Password"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ mt: 3 }}
            >
              Update Password
            </LoadingButton>
          </Stack>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </FormProvider>
  );
}
