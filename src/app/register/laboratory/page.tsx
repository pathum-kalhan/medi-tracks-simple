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

type FormValues = {
  labName: string;
  labRegNo: string;
  labLocation: string;
  contactNo: string | number;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Home() {
  const defaultValues = {
    labName: "",
    labRegNo: "",
    labLocation: "",
    contactNo: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const RegisterSchema: ZodType<FormValues> = z
    .object({
      labName: z
        .string({
          required_error: "required field",
          invalid_type_error: "Lab Name is required",
        })
        .min(3, "Lab Name must be at least 3 characters"),
      labRegNo: z
        .string({
          required_error: "required field",
          invalid_type_error: "Lab Registration Number is required",
        })
        .min(3, "Lab Registration Number must be at least 3 characters"),
      labLocation: z
        .string({
          required_error: "required field",
          invalid_type_error: "Lab Location is required",
        })
        .min(3, "Lab Location must be at least 3 characters"),
      contactNo: z
        .string({
          required_error: "required field",
          invalid_type_error: "Contact number is required",
        })
        .refine(
          (value) => /^(?:\d{10})$/.test(value),
          "Please enter a valid mobile number ex: 0771234568"
        )
        .transform((data) => Number(data)),
      email: z
        .string({
          required_error: "required field",
          invalid_type_error: "Email is required",
        })
        .email("Please enter a valid email"),
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    const response = await fetch("/api/user/laboratory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      toast.success(
        "Great! You have successfully registered. Please sign in to continue."
      );
    } else {
      toast.error(result.message);
    }
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
            maxHeight: 1000,
            margin: "0 auto",
            padding: 2,
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
            Laboratory Register
          </Typography>
          <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
            <RHFTextField name="labName" label="Lab Name" />
            <RHFTextField name="labRegNo" label="Lab Registration Number" />
            <RHFTextField name="labLocation" label="Lab Location" />
            <RHFTextField
              name="contactNo"
              label="Contact Number"
              type="number"
            />

            <RHFTextField name="email" label="Email" type="email" />
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
              href="/login/laboratory"
              variant="contained"
              fullWidth
              style={{ borderRadius: 20 }}
            >
              Have an account? Sign in
            </Button>
          </Stack>
        </Card>
      </FormProvider>
      <Toaster />
    </main>
  );
}
