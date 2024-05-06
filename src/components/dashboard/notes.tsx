import {
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  TextField,
  useTheme,
} from "@mui/material";
import {
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

type Props = {
  setOpen: (value: boolean) => void;
  open: boolean;
  id?: string;
  title: string;
  date: string;
  doctorName: string;
  validTill: string;
  notes: string;
  isIssued?: boolean;
  issuedRange?: number;
  type?: string;
  userType?: string;
};

export const Notes = ({
  open,
  setOpen,
  id,
  title,
  date,
  doctorName,
  validTill,
  notes,
  isIssued,
  issuedRange,
  type,
  userType,
}: Props) => {
  const { data: session } = useSession();

  const [localIsIssued, setLocalIsIssued] = useState(isIssued);
  const [localIssuedRange, setLocalIssuedRange] = useState(issuedRange);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = () => {
    setLocalIsIssued(!localIsIssued);
  };

  const handleRangeChange = (e: any) => {
    setLocalIssuedRange(e.target.value);
  };

  useEffect(() => {
    setLocalIsIssued(isIssued);
    setLocalIssuedRange(issuedRange);
  }, [isIssued, issuedRange, open]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        new URL(
          `/api/pharmacist/issued`,
          process.env.NEXT_PUBLIC_API_URL as string
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            id: id,
            isIssued: localIsIssued,
            issuedRange: localIssuedRange,
            type: type,
          }),
        }
      );

      if (!response.ok) {
        toast.error("Something happened, please try again later.");
      }
      toast.success("Data updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update data");
      setLocalIsIssued(isIssued);
      setLocalIssuedRange(issuedRange);
      setOpen(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        new URL(
          `/api/doctor/update`,
          process.env.NEXT_PUBLIC_API_URL as string
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            id: id,
            notes: notes,
          }),
        }
      );

      if (!response.ok) {
        toast.error("Something happened, please try again later.");
      }
      toast.success("Data updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update data");
      setOpen(false);
    }
  };

  const handlePrescription = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch(
        new URL(
          `/api/doctor/prescription`,
          process.env.NEXT_PUBLIC_API_URL as string
        ),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            id: id,
            prescription: e.target.prescription.value,
          }),
        }
      );

      if (!response.ok) {
        toast.error("Something happened, please try again later.");
      } else {
        toast.success("Data updated successfully");
      }
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update data");
      setOpen(false);
    }
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <form onSubmit={handlePrescription}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} justifyContent="space-evenly">
            <Grid item>Date: {date}</Grid>
            <Grid item>Doctor. {doctorName}</Grid>
            <Grid item>Valid Till: {validTill}</Grid>
          </Grid>

          <TextField
            fullWidth
            multiline
            defaultValue={notes}
            name="prescription"
            disabled={userType === "doctor" ? false : true}
          />

          <FormControlLabel
            control={
              <Switch
                checked={localIsIssued}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
                disabled={userType === "pharmacist" ? false : true}
              />
            }
            label="Fully Issued"
          />
        </DialogContent>
        <DialogActions>
          {userType === "pharmacist" && (
            <Button onClick={handleSubmit} type="submit">
              Save
            </Button>
          )}
          {userType === "doctor" && <Button type="submit">Update</Button>}
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
