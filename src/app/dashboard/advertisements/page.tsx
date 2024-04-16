"use client";

import { UploadButton } from "@/components/utils/uploadthing";
import toast from "react-hot-toast";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        endpoint="advertisements"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          toast.success("Advertisement uploaded successfully!");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          toast.error("Failed to upload file");
        }}
      />
    </main>
  );
}
