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
import { useState } from "react";

type FormValues = {
  nic: string;
  password: string;
};

export function Login() {
  const [title, setTitle] = useState("Patient");

  const defaultValues = {
    nic: "",
    password: "",
  };

  const LoginSchema: ZodType<FormValues> = z.object({
    nic: z
      .string({
        required_error: "required field",
        invalid_type_error: "NIC is required",
      })
      .refine(
        (value) => /^(?:\d{12}|\d{9}V)$/.test(value),
        "Please enter a valid NIC number ex: 123456789012 or 123456789V"
      ),
    password: z
      .string({
        required_error: "required field",
        invalid_type_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
  });

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(LoginSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    reset();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
          {title} Login
        </Typography>
        <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
          <RHFTextField name="nic" label="NIC" />
          <RHFTextField name="password" label="Password" type="password" />
          <MUILink href={`/register/${title.toLowerCase()}`} component={Link}>
            Register as a new {title.toLowerCase()}
          </MUILink>
          <Button type="submit" variant="contained">
            Login
          </Button>
        </Stack>
        <Stack spacing={1} sx={{ alignItems: "center" }}>
          {title != "Patient" && (
            <MUILink
              href="/login"
              component={Link}
              onClick={() => setTitle("Patient")}
            >
              Login as a patient
            </MUILink>
          )}
          {title != "Doctor" && (
            <MUILink
              href="/login#doctor"
              component={Link}
              onClick={() => setTitle("Doctor")}
            >
              Login as a doctor
            </MUILink>
          )}
          {title != "Laboratory" && (
            <MUILink
              href="/login#lab"
              component={Link}
              onClick={() => setTitle("Laboratory")}
            >
              Login as a laboratory
            </MUILink>
          )}
          {title != "Pharmacy" && (
            <MUILink
              href="/login#pharmacy"
              component={Link}
              onClick={() => setTitle("Pharmacy")}
            >
              Login as a pharmacy
            </MUILink>
          )}
        </Stack>
      </Card>
    </FormProvider>
  );
}
