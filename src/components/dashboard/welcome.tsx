import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { Fragment } from "react";

type Props = {
  name: string;
  data: { left: string; right: string }[];
};

export const Welcome = ({ name, data }: Props) => {
  return (
    <main>
      <Typography variant="h3" align="center" sx={{ mt: 2 }}>
        Welcome
      </Typography>
      <Typography variant="h5" align="center" sx={{ mt: 1 }}>
        Dr .xxxxxx
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Box bgcolor={"secondary.main"} sx={{ p: 4, mx: 12 }}>
        <Grid container spacing={2}>
          {data.map((item, index) => (
            <Fragment key={index}>
              <Grid item xs={6}>
                <Typography sx={{ ml: 12 }}>{item.left}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>: {item.right}</Typography>
              </Grid>
            </Fragment>
          ))}
        </Grid>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 8, ml: 54, px: 6, py: 1 }}
        style={{ borderRadius: 20 }}
      >
        Search Patient
      </Button>
    </main>
  );
};
