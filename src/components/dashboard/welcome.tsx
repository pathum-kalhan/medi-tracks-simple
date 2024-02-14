import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import FormDialog from "./search";
import { Fragment } from "react";

type Props = {
  name: string;
  data: { left: string; right: string }[];
};

export const Welcome = ({ name, data }: Props) => {
  return (
    <main>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" align="center">
            Welcome
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center" sx={{ mt: 1 }}>
            Dr .xxxxxx
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      <Box bgcolor={"secondary.main"} sx={{ p: 4, mx: 12 }}>
        <Stack spacing={2}>
          {data.map((item, index) => (
            <Typography key={index}>
              {item.left}: {item.right}
            </Typography>
          ))}
        </Stack>
      </Box>
      <FormDialog />
    </main>
  );
};
