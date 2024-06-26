"use client";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type Props<T> = {
  columns: GridColDef[];
  rows: T[];
  hideFooter?: boolean;
  pageSize?: number;
};

export default function DataTable({
  columns,
  rows,
  pageSize,
  ...other
}: Props<any>) {
  return (
    <Box sx={{ height: "100%" }}>
      <DataGrid
        getRowId={(row) => row._id}
        sx={{ m: 2 }}
        rows={rows}
        columns={columns}
        autoHeight
        style={{ minWidth: "100%" }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: pageSize },
          },
          sorting: { sortModel: [{ field: "createdAt", sort: "desc" }] },
        }}
        pageSizeOptions={[5, 10]}
        {...other}
      />
    </Box>
  );
}
