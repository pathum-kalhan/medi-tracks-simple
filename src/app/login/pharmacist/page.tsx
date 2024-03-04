"use client";
import { Button, Card, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { Link as MUILink } from "@mui/material";

import { logIn } from "@/actions/login/pharmacist";
import toast from "react-hot-toast";
import { useFormState } from "react-dom";

export default function Page() {
  const initialState = { message: null };

  // @ts-ignore
  const [state, dispatch] = useFormState(logIn, initialState);
  toast.error(state.message);

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
          Pharmacist Login
        </Typography>
        <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
          <TextField
            name="regNo"
            label="Pharmacist Registration Number"
            type="text"
          />
          <TextField name="password" label="Password" type="password" />
          <MUILink href={`/register/pharmacist`} component={Link}>
            Register as a new pharmacist
          </MUILink>
          <Button type="submit" variant="contained">
            Login
          </Button>
        </Stack>
        <Stack spacing={1} sx={{ alignItems: "center" }}>
          <MUILink href="/login/patient" component={Link}>
            Login as a patient
          </MUILink>

          <MUILink href="/login/doctor" component={Link}>
            Login as a doctor
          </MUILink>

          <MUILink href="/login/pharmacist" component={Link}>
            Login as a pharmacy
          </MUILink>
        </Stack>
      </Card>
    </form>
  );
}
