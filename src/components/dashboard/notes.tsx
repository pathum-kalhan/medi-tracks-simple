import { Grid, TextField, useTheme } from "@mui/material";
import {
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

type Props = {
  setOpen: (value: boolean) => void;
  open: boolean;
  title: string;
  date: string;
  doctorName: string;
  validTill: string;
  notes: string;
};

export const Notes = ({
  open,
  setOpen,
  title,
  date,
  doctorName,
  validTill,
  notes,
}: Props) => {
  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} justifyContent="space-evenly">
          <Grid item>Date: {date}</Grid>
          <Grid item>Doctor. {doctorName}</Grid>
          <Grid item>Valid Till: {validTill}</Grid>
        </Grid>
        <TextField fullWidth multiline value={notes} disabled />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
