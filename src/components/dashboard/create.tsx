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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { ZodType, z } from "zod";

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

  const defaultValues = {
    nic: "",
    name: "",
    mobile: "",
  };

  const CreateSchema: ZodType<FormValues> = z.object({
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
    resolver: zodResolver(CreateSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    reset();
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Create Patient Record</DialogTitle>
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
            Create
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};
