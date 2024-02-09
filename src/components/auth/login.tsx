"use client";

import FormProvider from "@/Forms/FormProvider";
import RHFTextField from "@/Forms/RHFTextField";
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
  nic: string;
  password: string;
};

export function Login() {
  const defaultValues = {
    nic: "",
    password: "",
  };

  const methods = useForm<FormValues>({ defaultValues });

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
          backgroundColor: "#bdbdbd",
          borderRadius: 5,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          align="center"
          variant="h3"
          sx={{
            color: "white",
            mb: 4,
          }}
        >
          Patients Login
        </Typography>
        <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
          <RHFTextField name="nic" label="NIC" />
          <RHFTextField name="password" label="Password" type="password" />
          <MUILink href="/register" component={Link}>
            Register as a new user
          </MUILink>
          <Button type="submit" variant="contained">
            Login
          </Button>
        </Stack>
        <Stack spacing={1} sx={{ alignItems: "center" }}>
          <MUILink href="/login" component={Link}>
            Login as a doctor
          </MUILink>
          <MUILink href="/login" component={Link}>
            Login as a laboratory
          </MUILink>
          <MUILink href="/login" component={Link}>
            Login as a pharmacy
          </MUILink>
        </Stack>
      </Card>
    </FormProvider>
  );
}
