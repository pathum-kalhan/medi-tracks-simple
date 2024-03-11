"use client";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";

type Notifications = {
  _id: string;
  message: string;
  read: boolean;
}[];

export default function Home() {
  const [notifications, setNotifications] = useState<Notifications>();

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch(
        new URL("/api/profile", process.env.NEXT_PUBLIC_API_URL as string),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      const data = await response.json();
      setNotifications(data.data.notifications);
    };
    fetchNotifications();
  }, []);

  const handleClose = async (_id: string) => {
    const res = await fetch(
      new URL("/api/profile", process.env.NEXT_PUBLIC_API_URL as string),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ read: true, _id }),
      }
    );
    const data = await res.json();
    setNotifications(data.data.notifications);
  };
  const allRead = notifications?.every((notification) => notification.read);
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
      <Stack spacing={2} sx={{ width: "100%" }}>
        {notifications &&
          notifications?.length > 0 &&
          notifications?.map(
            (notification) =>
              !notification.read && (
                <Alert
                  key={notification._id}
                  icon={<CheckIcon fontSize="inherit" />}
                  severity="success"
                  sx={{ width: "100%" }}
                  onClose={() => handleClose(notification._id)}
                >
                  {notification.message}
                </Alert>
              )
          )}
        {allRead && <Alert severity="info">No new notifications</Alert>}
      </Stack>
    </Box>
  );
}
