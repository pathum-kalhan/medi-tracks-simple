import {
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  ListItemButton,
  Divider,
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2/Grid2";

export const NavBar = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      <nav aria-label="avatar">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="MediTracks Pro" />
            </ListItemButton>
          </ListItem>
          <Avatar
            alt="Remy Sharp"
            src="/static/images/avatar/1.jpg"
            sx={{ width: 220, height: 225 }}
          />
        </List>
      </nav>
      <Divider />

      <nav aria-label="links">
        <List>
          <ListItem disablePadding>
            <ListItemButton href="/dashboard">
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton href="/dashboard/patient-records">
              <ListItemText primary="Patient Records" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton href="/dashboard/lab-reports">
              <ListItemText primary="Lab Reports" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton href="/help">
              <ListItemText primary="Help & Support" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton href="/account">
              <ListItemText primary="Account & Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
};
