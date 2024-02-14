import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type Props<T> = {
  columns: GridColDef[];
  rows: T[];
};

export default function DataTable({ columns, rows }: Props<any>) {
  return (
    <Box sx={{ height: "100%", overflowX: "auto" }}>
      <DataGrid
        sx={{ m: 2 }}
        rows={rows}
        columns={columns}
        autoHeight
        style={{ minWidth: "100%" }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </Box>
  );
}
