"use client";

import { Avatar, Box, Button, Stack, TextField, styled } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { updatePicture, State } from "@/actions/profile/update-picture";
import { useFormState } from "react-dom";
import { FormEvent, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";

type User = {
  name: string;
  phone: string;
  avatar: string;
};

export default function Home() {
  const [state, dispatch] = useFormState<State, FormData>(updatePicture, null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.status === "success") {
      setLoading(false);
      toast.success(state.message);
    }
    if (state.status === "error") {
      setLoading(false);
      toast.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        new URL("/api/profile", process.env.NEXT_PUBLIC_API_URL as string),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      const data = await res.json();
      setUser(data.data);
    };
    fetchData();
  }, [state?.status]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <form action={dispatch} onSubmit={handleSubmit}>
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
        <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
          <Button component="label" role={undefined} tabIndex={-1}>
            <Avatar
              alt={user?.name}
              src={user?.avatar}
              sx={{ width: 100, height: 100 }}
            />
            <VisuallyHiddenInput required type="file" name="avatar" />
          </Button>

          <LoadingButton type="submit" variant="contained" loading={loading}>
            Update Profile Picture
          </LoadingButton>
        </Stack>
        <Toaster />
      </Box>
    </form>
  );
}
