"use client";

import { ToastContainer } from "react-toastify";

export const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick
      theme="colored"
    />
  );
};
