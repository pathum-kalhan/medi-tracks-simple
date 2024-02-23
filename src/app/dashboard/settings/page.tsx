import { Grid } from "@mui/material";
import { Link as MUILink } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Grid
      container
      spacing={10}
      direction="column"
      alignItems="center"
      padding={2}
    >
      <Grid item xs={12}>
        <MUILink href={"#"} component={Link}>
          Change Password
        </MUILink>
      </Grid>
      <Grid item xs={12}>
        <MUILink href={"/dashboard/settings/notifications"} component={Link}>
          Notification
        </MUILink>
      </Grid>
      <Grid item xs={12}>
        <MUILink href={"#"} component={Link}>
          Security
        </MUILink>
      </Grid>
      <Grid item xs={12}>
        <MUILink href={"/dashboard/settings/accessibility"} component={Link}>
          Accessibility
        </MUILink>
      </Grid>
    </Grid>
  );
}
