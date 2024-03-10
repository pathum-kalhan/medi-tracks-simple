"use client";

import { Box, Button, Stack, TextField } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { updateProfile, State } from "@/actions/profile/update-profile";
import { useFormState } from "react-dom";
import { FormEvent, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";

type FormValue = {
  oldPassword: string;
  newPassword: string;
};

type Profile = {
  name: string;
  phone: string;
};

export default function Home() {
  const [state, dispatch] = useFormState<State, FormData>(updateProfile, null);

  const [profile, setProfile] = useState<Profile>();
  const [loading, setLoading] = useState(false);

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
      setProfile(data.data);
    };
    fetchData();
  }, []);

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
  };

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
        <Stack spacing={2}>
          <TextField
            name="name"
            size="small"
            defaultValue={profile?.name}
            error={state?.errors?.name ? true : false}
            helperText={state?.errors?.name}
          />
          <TextField
            name="phone"
            size="small"
            defaultValue={profile?.phone}
            error={state?.errors?.phone ? true : false}
            helperText={state?.errors?.phone}
          />
          <LoadingButton type="submit" variant="contained" loading={loading}>
            Update Profile
          </LoadingButton>
        </Stack>
        <Toaster />
      </Box>
    </form>
  );
}
