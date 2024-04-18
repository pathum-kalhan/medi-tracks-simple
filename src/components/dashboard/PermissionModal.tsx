"use client";
import {
  Modal,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import FormProvider from "@/Forms/FormProvider";
import { LoadingButton } from "@mui/lab";
import RHFTextField from "@/Forms/RHFTextField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

interface PermissionModalProps {
  nic: string;
  onClose: (value: boolean) => void;
  open: boolean;
}

const PermissionModal: React.FC<PermissionModalProps> = ({
  nic,
  onClose,
  open,
}) => {
  const DoctorPermission =
    typeof window !== "undefined"
      ? sessionStorage.getItem("DoctorPermission")
      : "";

  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const VerifyCodeSchema = z.object({
    otp: z.string().min(1, { message: "OTP is required" }),
  });

  const defaultValues = {
    otp: "",
  };

  const methods = useForm({
    mode: "onChange",
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const handleClose = () => {
    onClose(false);
  };

  const onSubmit = async (data: { otp: string }) => {
    setIsLoading(true);
    if (data.otp === DoctorPermission) {
      reset(defaultValues);
      setIsLoading(false);
      push(`/dashboard/patient-records?nic=${nic}`);
    } else {
      setIsLoading(false);
      reset(defaultValues);
      toast.error("Invalid OTP");
    }
    sessionStorage.removeItem("DoctorPermission");
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="responsive-dialog-title">Submit OTP</DialogTitle>
          <DialogContent>
            <RHFTextField
              name="otp"
              label="OTP"
              type="text"
              required
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              sx={{ borderRadius: 15 }}
              loading={isLoading}
            >
              Submit
            </LoadingButton>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
};

export default PermissionModal;
