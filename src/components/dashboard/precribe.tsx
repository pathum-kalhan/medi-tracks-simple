"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useFormState } from "react-dom";
import { createPrescription, State } from "@/actions/doctor/add-data";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";

//type form

type Props = {
  setOpen: (value: boolean) => void;
  open: boolean;
  name: string;
  date: string;
  title: string;
  nic: string;
  type: "prescribe" | "surgery";
};

export const Prescribe = ({
  open,
  setOpen,
  name,
  date,
  title,
  type,
  nic,
}: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [state, dispatch] = useFormState<State, FormData>(
    createPrescription,
    null
  );
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
      setLoading(false);
      toast.error(state.message);
    }
  }, [state]);

  const handleClose = () => {
    setOpen(false);
  };

  console.log(state?.errors);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} fullWidth>
      <form action={dispatch} onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid
            container
            spacing={1}
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Grid item>
              <TextField name="name" size="small" value={name} disabled />
              <input name="nic" value={nic} type="hidden" />
            </Grid>
            <Grid item>Time : {date}</Grid>
          </Grid>
          <Stack spacing={2}>
            <TextField
              name="hospital"
              label="Hospital"
              size="small"
              required
              fullWidth
              error={!!state?.errors?.hospital ? true : false}
              helperText={state?.errors?.hospital?.[0]}
            />
            {type === "prescribe" && (
              <TextField
                name="disease"
                label="Disease"
                size="small"
                required
                fullWidth
                error={!!state?.errors?.disease ? true : false}
                helperText={state?.errors?.disease?.[0]}
              />
            )}
            <TextField
              name="medicine"
              label="Medicine"
              size="small"
              required
              fullWidth
              multiline
              rows={5}
              error={!!state?.errors?.medicine ? true : false}
              helperText={state?.errors?.medicine?.[0]}
            />
            <TextField
              name="validTill"
              type="date"
              size="small"
              required
              fullWidth
              error={!!state?.errors?.validTill ? true : false}
              helperText={state?.errors?.validTill?.[0]}
            />
            {type === "surgery" && (
              <TextField
                name="surgeryName"
                label="Surgery Name"
                size="small"
                required
                fullWidth
              />
            )}
            <TextField
              name="doctorNotes"
              label="Doctor Notes"
              size="small"
              required
              fullWidth
              multiline
              rows={3}
              error={!!state?.errors?.doctorNote ? true : false}
              helperText={state?.errors?.doctorNote?.[0]}
            />
            <input type="hidden" name="type" value={type} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            sx={{ borderRadius: 15 }}
            loading={loading}
          >
            {type === "prescribe" ? "Prescribe" : "Add Surgery"}
          </LoadingButton>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
