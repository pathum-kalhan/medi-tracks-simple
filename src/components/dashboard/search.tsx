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

type FormValues = {
  id: string;
  nic: string;
  name: string;
  mobile: string | number;
};

export default function FormDialog() {
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const defaultValues = {
    id: "",
    nic: "",
    name: "",
    mobile: "",
  };

  const LoginSchema: ZodType<FormValues> = z.object({
    id: z
      .string({
        required_error: "required field",
        invalid_type_error: "ID is required",
      })
      .min(6, "ID must be at least 6 characters"),
    nic: z
      .string({
        required_error: "required field",
        invalid_type_error: "NIC is required",
      })
      .refine(
        (value) => /^(?:\d{12}|\d{9}V)$/.test(value),
        "Please enter a valid NIC number ex: 123456789012 or 123456789V"
      ),
    name: z
      .string({
        required_error: "required field",
        invalid_type_error: "Name is required",
      })
      .min(3, "Name must be at least 3 characters"),
    mobile: z
      .string({
        required_error: "required field",
        invalid_type_error: "Mobile is required",
      })
      .refine(
        (value) => /^[0-9]{10}$/.test(value),
        "Please enter a valid mobile number ex: 0771234567"
      ),
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
    <Grid item spacing={2}>
      <Grid xs={12} md={6} item>
        <Button
          variant="contained"
          onClick={handleClickOpen}
          sx={{ mx: 56, mt: 4, px: 4, py: 1, borderRadius: 15 }}
        >
          Search Patient
        </Button>
      </Grid>
      <Grid xs={12} md={6}>
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
                <RHFTextField name="id" label="Patient ID" fullWidth />
                <RHFTextField name="nic" label="NIC" fullWidth />
                <RHFTextField name="name" label="Patient Name" fullWidth />
                <RHFTextField
                  name="mobile"
                  label="Mobile No"
                  fullWidth
                  type="number"
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                type="submit"
                sx={{ borderRadius: 15 }}
              >
                Search
              </Button>
              <Button
                variant="contained"
                sx={{ borderRadius: 15 }}
                onClick={handleCreatePatientRecords}
              >
                Create Patient Record
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </FormProvider>
        </Dialog>
      </Grid>
      <CreatePatient setOpen={setOpenCreate} open={openCreate} />
    </Grid>
  );
}
