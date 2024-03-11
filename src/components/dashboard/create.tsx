"use client";
import FormProvider from "@/Forms/FormProvider";
import RHFTextField from "@/Forms/RHFTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { useFormState } from "react-dom";
import { createPatient, State } from "@/actions/doctor/create-patient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type FormValues = {
  nic: string;
  name: string;
  mobile: string | number;
};

type Props = {
  setOpen: (value: boolean) => void;
  open: boolean;
};

export const CreatePatient = ({ setOpen, open }: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  // const [state, dispatch] = useFormState<State, FormData>(createPatient, null);
  // const router = useRouter();

  // useEffect(() => {
  //   if (!state) {
  //     return;
  //   }
  //   if (state.status === "success") {
  //     console.log("here", state);
  //     router.push(`/patient-records?nic=${state.message}`);
  //   }
  //   if (state.status === "error") {
  //     toast.error(state.message);
  //   }
  // }, [router, state]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <form action={createPatient} onSubmit={handleClose}>
        <DialogTitle>Create Patient Record</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
            <TextField name="nic" label="NIC" size="small" fullWidth />
            <TextField
              name="name"
              label="Patient Name"
              size="small"
              fullWidth
            />
            <TextField
              name="phone"
              label="Mobile No"
              size="small"
              fullWidth
              type="number"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="submit" sx={{ borderRadius: 15 }}>
            Create
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </form>
      <Toaster />
    </Dialog>
  );
};
