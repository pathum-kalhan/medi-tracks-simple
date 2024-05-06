"use client";
import { Fragment, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import RHFTextField from "@/Forms/RHFTextField";
import FormProvider from "@/Forms/FormProvider";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { Grid, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CreatePatient } from "./create";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@mui/lab";
import queryString from "query-string";
import { useSession } from "next-auth/react";

type FormValues = {
  nic: string;
  name: string;
  phone: string;
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: string;
};

export default function FormDialog({ open, setOpen, type }: Props) {
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const { data: session } = useSession();
  const userType = session?.user?.type;

  const defaultValues = {
    nic: "",
    name: "",
    phone: "",
  };

  const methods = useForm<FormValues>();

  const { handleSubmit, reset } = methods;

  const onSubmit = (data: FormValues) => {
    const query = queryString.stringify(data);
    if (query) {
      router.push(`/dashboard/search?${query}&type=${type}`);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleCreatePatientRecords = () => {
    reset();
    setOpen(false);
    setOpenCreate(true);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        aria-labelledby="responsive-dialog-title"
      >
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="responsive-dialog-title">
            Patient Records
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
              <RHFTextField name="nic" label="NIC" fullWidth />
              <RHFTextField name="name" label="Patient Name" fullWidth />
              <RHFTextField
                name="phone"
                label="Mobile No"
                type="number"
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              sx={{ borderRadius: 15 }}
              loading={loading}
            >
              Search
            </LoadingButton>
            {userType === "doctor" && (
              <Button
                variant="contained"
                sx={{ borderRadius: 15 }}
                onClick={handleCreatePatientRecords}
              >
                Create Patient Record
              </Button>
            )}
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </FormProvider>
      </Dialog>

      <CreatePatient setOpen={setOpenCreate} open={openCreate} />
    </>
  );
}
