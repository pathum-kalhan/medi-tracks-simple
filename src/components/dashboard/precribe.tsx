import FormProvider from "@/Forms/FormProvider";
import RHFTextField from "@/Forms/RHFTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChangeEvent, FormEvent } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ZodType, z } from "zod";

//type form

type Props = {
  setOpen: (value: boolean) => void;
  open: boolean;
  name: string;
  date: string;
  title: string;
  type: "prescribe" | "surgery";
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

export const Prescribe = ({
  open,
  setOpen,
  name,
  date,
  title,
  type,
}: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const defaultValues = {
    hospital: "",
    decease: "",
    medicine: "",
    validTill: "",
    doctorNotes: "",
  };

  let schema: ZodType;
  switch (type) {
    case "prescribe":
      schema = z.object({
        hospital: z.string(),
        decease: z.string(),
        medicine: z.string(),
        validTill: z.string(),
        doctorNotes: z.string(),
      });
      break;
    case "surgery":
      schema = z.object({
        hospital: z.string(),
        medicine: z.string(),
        validTill: z.string(),
        surgeryName: z.string(),
        doctorNotes: z.string(),
      });
      break;
  }
  const methods = useForm({ resolver: zodResolver(schema), defaultValues });

  const { setValue, control, handleSubmit, reset } = methods;

  const onSubmit = (data: any) => {
    console.log(data);
    reset();
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };
  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} fullWidth>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Grid item>Dr. {name}</Grid>
            <Grid item>Date: {date}</Grid>
          </Grid>
          <Stack spacing={2}>
            <RHFTextField name="hospital" label="Hospital" required fullWidth />
            {type === "prescribe" && (
              <RHFTextField name="decease" label="Decease" required fullWidth />
            )}
            <RHFTextField
              name="medicine"
              label="Medicine"
              required
              fullWidth
              multiline
              rows={5}
            />
            <RHFTextField name="validTill" type="date" required fullWidth />
            {type === "surgery" && (
              <RHFTextField
                name="surgeryName"
                label="Surgery Name"
                required
                fullWidth
              />
            )}
            <RHFTextField
              name="doctorNotes"
              label="Doctor Notes"
              required
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="submit" sx={{ borderRadius: 15 }}>
            Submit
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};
