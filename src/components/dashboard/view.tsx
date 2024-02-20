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
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChangeEvent, FormEvent } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ZodType, z } from "zod";

type FormValues = {
  id: string;
  nic: string;
  name: string;
  testType: string;
  file: File | null;
};

type Props = {
  setOpen: (value: boolean) => void;
  open: boolean;
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const ViewPatient = ({ setOpen, open }: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const defaultValues = {
    id: "",
    nic: "",
    name: "",
    testType: "",
    file: null,
  };

  const LabReportUpload: ZodType<FormValues> = z.object({
    id: z
      .string({
        required_error: "required field",
        invalid_type_error: "ID is required",
      })
      .min(3, "ID must be at least 3 characters"),
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
    testType: z.string(),
    file: z.instanceof(File).nullable(),
  });

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(LabReportUpload),
  });

  const { setValue, control, handleSubmit, reset } = methods;

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
        <DialogTitle>Upload lab report</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
            <RHFTextField name="id" label="Patient ID" disabled fullWidth />
            <RHFTextField name="nic" label="NIC" disabled fullWidth />
            <RHFTextField name="name" label="Patient Name" disabled fullWidth />
            <RHFTextField name="testType" label="Test Type" fullWidth />
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <Button
                  {...field}
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  onChange={(event) => {
                    const file =
                      (event.target as HTMLInputElement).files?.[0] || null;
                    setValue("file", file);
                  }}
                >
                  Upload file
                  <VisuallyHiddenInput type="file" />
                </Button>
              )}
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
