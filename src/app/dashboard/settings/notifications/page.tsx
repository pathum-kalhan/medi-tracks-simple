"use client";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        color: "text.primary",
        borderRadius: 1,
        p: 3,
      }}
    >
      {open && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          onClose={handleClose}
        >
          Asiri laboratory is submitted your reports and there ready to view
        </Alert>
      )}
    </Box>
  );
}
