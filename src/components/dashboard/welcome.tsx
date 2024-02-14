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
      <Grid container spacing={2} sx={{ width: "100%", mx: 0 }}>
        <Grid xs={12} sm={12}>
          <Typography variant="h3" align="center">
            Welcome
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant="h5" align="center" sx={{ mt: 1 }}>
            Dr .xxxxxx
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      <Box bgcolor={"secondary.main"} sx={{ p: 4 }}>
        <Grid container spacing={2}>
          {data.map((item, index) => (
            <Fragment key={index}>
              <Grid item xs={6}>
                <Typography>{item.left}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>: {item.right}</Typography>
              </Grid>
            </Fragment>
          ))}
        </Grid>
      </Box>
      <FormDialog />
    </main>
  );
};
