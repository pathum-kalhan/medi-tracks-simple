"use client";

import FormDialog from "@/components/dashboard/search";
import { Button } from "@mui/material";
import { useState } from "react";

export const SearchPatientButton = () => {
  const [open, setOpen] = useState(false);

  const handlePatientClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        sx={{ m: 1 }}
        onClick={handlePatientClick}
      >
        Search Patient
      </Button>
      <FormDialog open={open} setOpen={setOpen} />
    </>
  );
};
