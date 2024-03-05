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

type FormValues = {
  nic: string;
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function FormDialog({ open, setOpen }: Props) {
  const [openCreate, setOpenCreate] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const defaultValues = {
    nic: "",
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
  });

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(LoginSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    router.push(`/dashboard/search?nic=${data.nic}`);
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
                name="mobile"
                label="Mobile No"
                fullWidth
                type="number"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit" sx={{ borderRadius: 15 }}>
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

      <CreatePatient setOpen={setOpenCreate} open={openCreate} />
    </>
  );
}
