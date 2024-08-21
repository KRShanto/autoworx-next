"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { getToken } from "../actions/actions";

const Page = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  useEffect(() => {
    if (code) getToken(code);
  }, []);

  return <div></div>;
};

export default Page;
