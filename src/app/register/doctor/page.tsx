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

type FormValues = {
  name: string;
  slmcNo: string;
  phone: string | number;
  otp: string;
  password: string;
  confirmPassword: string;
};

export default function Home() {
  const defaultValues = {
    name: "",
    slmcNo: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: "",
  };

  const RegisterSchema: ZodType<FormValues> = z
    .object({
      name: z
        .string({
          required_error: "required field",
          invalid_type_error: "Name is required",
        })
        .min(3, "Name must be at least 3 characters"),
      slmcNo: z
        .string({
          required_error: "required field",
          invalid_type_error: "NIC is required",
        })
        .min(3, "SLMCC No. must be at least 3 characters"),
      phone: z
        .string({
          required_error: "required field",
          invalid_type_error: "Mobile number is required",
        })
        .refine(
          (value) => /^(?:\d{10})$/.test(value),
          "Please enter a valid mobile number ex: 0771234568"
        )
        .transform((data) => Number(data)),
      otp: z
        .string({
          required_error: "required field",
          invalid_type_error: "OTP is required",
        })
        .refine(
          (value) => /^(?:\d{4})$/.test(value),
          "Please enter 4 digit OTP number ex: 1234"
        ),
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

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(RegisterSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    reset();
  };
  return (
    <main>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
            <RHFTextField name="name" label="Full Name" />
            <RHFTextField name="slmcNo" label="SLMC No." />
            <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
              <RHFTextField name="phone" label="Phone" type="number" />
              <Button
                color="green"
                variant="contained"
                style={{ borderRadius: 10 }}
              >
                Verify
              </Button>
            </Stack>

            <RHFTextField name="otp" label="OTP" />
            <RHFTextField name="password" label="Password" type="password" />
            <RHFTextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
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
              href="/login#doctor"
              variant="contained"
              color="purple"
              fullWidth
              style={{ borderRadius: 20 }}
            >
              Have an account? Sign in
            </Button>
          </Stack>
        </Card>
      </FormProvider>
    </main>
  );
}
