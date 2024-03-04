"use client";

import { Box, Button, Typography } from "@mui/material";
import DataTable from "./table";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  row: any[];
  column: any[];
  href: string;
};

export const Card = ({ title, row, column, href }: Props) => {
  const router = useRouter();

  const handlePrescribedMedicationsClick = () => {
    router.push(href);
  };
  return (
    <Box sx={{ p: 1, bgcolor: "background.paper" }}>
      <Box sx={{ p: 1, bgcolor: "background.paper" }}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <DataTable columns={column} rows={row} pageSize={4} hideFooter />

      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <Button
          color="primary"
          variant="contained"
          onClick={handlePrescribedMedicationsClick}
          sx={{ textTransform: "none" }}
        >
          View all
        </Button>
      </Box>
    </Box>
  );
};
