"use client";
import FormProvider from "@/Forms/FormProvider";
import RHFTextField from "@/Forms/RHFTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { fileUpload, State } from "@/actions/laboratory/file-upload";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { set } from "mongoose";

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

export const LabReportUpload = ({ setOpen, open }: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [state, dispatch] = useFormState<State, FormData>(fileUpload, null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.status === "success") {
      setLoading(false);
      toast.success(state.message);
    }
    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
  };
  console.log(state?.errors);
  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <form action={dispatch} onSubmit={handleSubmit}>
        <DialogTitle>Upload lab report</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
            <TextField
              name="nic"
              label="NIC"
              size="small"
              error={state?.errors?.nic ? true : false}
              helperText={state?.errors?.nic}
              fullWidth
            />

            <TextField
              name="name"
              label="Patient Name"
              size="small"
              error={state?.errors?.name ? true : false}
              helperText={state?.errors?.name}
              fullWidth
            />
            <TextField
              name="testType"
              label="Test Type"
              size="small"
              error={state?.errors?.testType ? true : false}
              helperText={state?.errors?.testType}
              fullWidth
            />
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
            >
              Upload file
              <VisuallyHiddenInput required type="file" name="files" />
            </Button>
            {state?.errors?.files && (
              <Alert severity="error">{state?.errors?.files}</Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            type="submit"
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            sx={{ borderRadius: 15 }}
            loading={loading}
          >
            Save
          </LoadingButton>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
