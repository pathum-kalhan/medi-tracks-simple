"use client";

import FormProvider from "@/Forms/FormProvider";
import RHFTextField from "@/Forms/RHFTextField";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

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
import { AuthError } from "next-auth";
import toast, { Toaster } from "react-hot-toast";
// import { signIn } from "@/auth";

type Props = {
  role: "patient" | "doctor" | "laboratory" | "pharmacist";
};

export function Login({ role }: Props) {
  const [title, setTitle] = useState(role);

  const router = useRouter();

  let schema: ZodType;
  switch (role) {
    case "patient":
      schema = z.object({
        nic: z.string().min(10),
        password: z.string().min(6),
      });
      break;
    case "doctor":
      schema = z.object({
        slmc: z.string().min(6),
        password: z.string().min(6),
      });
      break;
    case "laboratory":
      schema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
      });
      break;
    case "pharmacist":
      schema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
      });
      break;
  }
  const methods = useForm({ resolver: zodResolver(schema) });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<any> = async (data) => {
    // const loginData = {
    //   ...data,
    //   role: role,
    // };
    // const res = await signIn("credentials", loginData);
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
          {title.charAt(0).toUpperCase() + title.slice(1) + " Login"}
        </Typography>
        <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
          {role === "patient" && (
            <RHFTextField name="nic" label="NIC" type="text" />
          )}
          {role === "doctor" && (
            <RHFTextField name="slmc" label="SLMC" type="text" />
          )}
          {(role === "laboratory" || role === "pharmacist") && (
            <RHFTextField name="email" label="Email" type="email" />
          )}

          <RHFTextField name="password" label="Password" type="password" />
          <MUILink href={`/register/${title.toLowerCase()}`} component={Link}>
            Register as a new {title.toLowerCase()}
          </MUILink>
          <Button type="submit" variant="contained">
            Login
          </Button>
        </Stack>
        <Stack spacing={1} sx={{ alignItems: "center" }}>
          {role != "patient" && (
            <MUILink
              href="/login/patient"
              component={Link}
              onClick={() => setTitle("patient")}
            >
              Login as a patient
            </MUILink>
          )}
          {role != "doctor" && (
            <MUILink
              href="/login/doctor"
              component={Link}
              onClick={() => setTitle("doctor")}
            >
              Login as a doctor
            </MUILink>
          )}
          {role != "laboratory" && (
            <MUILink
              href="/login/laboratory"
              component={Link}
              onClick={() => setTitle("laboratory")}
            >
              Login as a laboratory
            </MUILink>
          )}
          {role != "pharmacist" && (
            <MUILink
              href="/login/pharmacist"
              component={Link}
              onClick={() => setTitle("pharmacist")}
            >
              Login as a pharmacy
            </MUILink>
          )}
        </Stack>
      </Card>
      <Toaster />
    </FormProvider>
  );
}
