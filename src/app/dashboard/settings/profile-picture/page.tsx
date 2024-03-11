"use client";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  styled,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { updatePicture, State } from "@/actions/profile/update-picture";
import { useFormState } from "react-dom";
import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useDropzone } from "react-dropzone";
import { ImagePreview } from "@/components/dashboard/image-preview";

type User = {
  name: string;
  phone: string;
  avatar: string;
};

type Accept = {
  [key: string]: string[];
};

type Props = {
  helpText: ReactNode;
  accept: Accept;
  maxSize: number;
};

export default function Home() {
  const [user, setUser] = useState<User>();
  const [state, dispatch] = useFormState<State, FormData>(updatePicture, null);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const removeImage = () => {
    setFiles([]);
  };

  const maxSize = 3;
  const accept = { "image/*": [".jpeg", ".jpg", ".png"] };

  const maxFileSize = maxSize * 1024 * 1024;

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    multiple: false,
    accept: accept,
    maxFiles: 1,
    maxSize: maxFileSize,
  });

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.status === "success") {
      toast.success(state.message);
    }
    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    const form = new FormData();
    if (files.length === 0) {
      return;
    }

    form.append("avatar", files[0]);
    dispatch(form);
  }, [files, dispatch]);

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
  }, []);

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
      <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
        <div>
          <div>
            {files.length > 0 && <button onClick={removeImage}>X</button>}
          </div>

          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {files.length > 0 ? (
              <ImagePreview src={files[0]} />
            ) : (
              <ImagePreview src={user?.avatar!} />
            )}
          </div>
        </div>
        {files.length === 0 && (
          <>
            <Alert>
              {"Click on the image to select photos from your computer"}
            </Alert>
            <Alert severity="warning">
              {"After select please wait a for the confirmation"}
            </Alert>
            <Alert severity="error">(Only images will be accepted)</Alert>
            {/* <FileRejections fileRejections={fileRejections} /> */}
          </>
        )}
      </Stack>
      <Toaster />
    </Box>
  );
}
