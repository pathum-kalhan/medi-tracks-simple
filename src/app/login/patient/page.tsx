"use client";
import { Button, Card, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { Link as MUILink } from "@mui/material";

import { logIn } from "@/actions/login/patient";
import toast from "react-hot-toast";
import { useFormState } from "react-dom";

export default function Page() {
  const initialState = { message: null };
  // @ts-ignore
  const [state, dispatch] = useFormState(logIn, initialState);

  if (state) {
    toast.error(state.message);
  }

  return (
    <form action={dispatch}>
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
          Patient Login
        </Typography>
        <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
          <TextField name="nic" label="NIC" type="text" size="small" />
          <TextField
            name="password"
            label="Password"
            type="password"
            size="small"
          />
          <MUILink href={`/register/patient`} component={Link}>
            Register as a new patient
          </MUILink>
          <Button type="submit" variant="contained">
            Login
          </Button>
        </Stack>
        <Stack spacing={1} sx={{ alignItems: "center" }}>
          <MUILink href="/login/doctor" component={Link}>
            Login as a doctor
          </MUILink>

          <MUILink href="/login/laboratory" component={Link}>
            Login as a laboratory
          </MUILink>

          <MUILink href="/login/pharmacist" component={Link}>
            Login as a pharmacy
          </MUILink>
        </Stack>
      </Card>
    </form>
  );
}
