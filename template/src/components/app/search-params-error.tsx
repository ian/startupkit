"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";
import toast from "react-hot-toast";

export const SearchParamsError = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useLayoutEffect(() => {
    if (!searchParams) {
      return;
    }

    const error = searchParams?.get("error");

    if (error) {
      const {
        error: _,
        error_description: __,
        ...params
      } = Object.fromEntries(searchParams); // Destructure to remove error

      toast.error(error);

      console.log(new URLSearchParams(params).toString());
      // router.replace(new URLSearchParams(params).toString()); // Update the router without the error param
    }
  });

  return null;
};
