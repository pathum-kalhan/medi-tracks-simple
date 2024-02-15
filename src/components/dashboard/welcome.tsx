"use client";
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import FormDialog from "./search";
import { Fragment, useState } from "react";

type Props = {
  name: string;
  data: { left: string; right: string }[];
};

export const Welcome = ({ name, data }: Props) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12}>
        <Typography variant="h3" align="center">
          Welcome
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Typography variant="h5" align="center" sx={{ mt: 1 }}>
          {name}
        </Typography>
      </Grid>

      <Grid container item xs={12} sm={12} md={12}>
        <Grid item xs={12} sm={12} md={12}>
          <Divider />
        </Grid>
        {data.map((item, index) => (
          <Fragment key={index}>
            <Grid item xs={6} sm={6} md={6} textAlign={"center"}>
              <Typography>{item.left}</Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <Typography>: {item.right}</Typography>
            </Grid>
          </Fragment>
        ))}
      </Grid>

      <Grid item xs={12} sm={12} md={12} textAlign={"center"}>
        <Button variant="contained" onClick={handleClick}>
          Search Patient
        </Button>
      </Grid>
      <FormDialog open={open} setOpen={setOpen} />
    </Grid>
  );
};
