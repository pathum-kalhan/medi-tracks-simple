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
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@mui/lab";

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
  const [state, dispatch] = useFormState<State, FormData>(createPatient, null);
  const [loading, setLoading] = useState(false);
  const [uiLoading, setUiLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.status === "success") {
      router.push(`/dashboard/patient-records?nic=${state.message}`);
      setOpen(false);
      setLoading(false);
    }
    if (state.status === "search") {
      router.push(`/dashboard/search?nic=${state.message}`);
      setOpen(false);
      setLoading(false);
    }
    if (state.status === "error") {
      setLoading(false);
      toast.error(state.message);
    }
  }, [router, state, setOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <form action={dispatch} onSubmit={handleSubmit}>
        <DialogTitle>Create Patient Record</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
            <TextField
              name="nic"
              label="NIC"
              size="small"
              fullWidth
              helperText={state?.errors?.nic}
              error={state?.errors?.nic ? true : false}
            />
            <TextField
              name="name"
              label="Patient Name"
              size="small"
              fullWidth
              helperText={state?.errors?.name}
              error={state?.errors?.name ? true : false}
            />
            <TextField
              name="mobile"
              label="Mobile No"
              size="small"
              fullWidth
              type="tel"
              helperText={state?.errors?.mobile}
              error={state?.errors?.mobile ? true : false}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
            sx={{ borderRadius: 15 }}
          >
            Create
          </LoadingButton>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </form>
      <Toaster />
    </Dialog>
  );
};
