"use client";

import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "./Button";
import { useState } from "react";

export const Upload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("no file!");
      return;
    }

    toast.success("Yeah!");
    const formData = new FormData();
    formData.append("user_file", file);

    // const response = await axios.post<UploadResponse>(`/upload`, data, {
    const response = await axios.post(`/api/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log({ response });
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="file_input"
        >
          Upload file
        </label>
        <input
          className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 py-2"
          name="user_file"
          id="file_input"
          onChange={handleFileChange}
          type="file"
        />
      </div>
      <div>
        <Button onClick={handleUpload}>Upload</Button>
      </div>
    </div>
  );
};
