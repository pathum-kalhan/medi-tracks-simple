"use client";

import { useState } from "react";
import { Prescribe } from "@/components/dashboard/precribe";

import { Button } from "@mui/material";

export function ProfileModel({ name }: { name: string }) {
  const [openPrescribe, setOpenPrescribe] = useState(false);
  const [openSurgery, setOpenSurgery] = useState(false);
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenPrescribe(true)}
        sx={{ m: 1 }}
      >
        Prescribe Medication
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenSurgery(true)}
        sx={{ m: 1 }}
      >
        Add Surgery Data
      </Button>
      <Prescribe
        open={openPrescribe}
        setOpen={setOpenPrescribe}
        title="Prescribe Medication"
        date={new Date().toDateString()}
        name={name}
        type="prescribe"
      />
      <Prescribe
        open={openSurgery}
        setOpen={setOpenSurgery}
        title="Add Surgery Data"
        date={new Date().toDateString()}
        name="John Doe"
        type="surgery"
      />
    </>
  );
}
