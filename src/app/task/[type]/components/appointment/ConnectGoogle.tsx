"use client";
import getUser from "@/lib/getUser";
import crypto from "crypto";
import { google } from "googleapis";
import { env } from "next-runtime-env";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { generateAuthURL, getCookies } from "./getCookie";

type Props = {};

const ConnectGoogle = (props: Props) => {
  const [cookie, setCookie] = useState<string>("");
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [inc, setInc] = useState(0);
  const router = useRouter();

  async function cookieFn() {
    let gotCookie = await getCookies();
    if (gotCookie) setCookie(gotCookie.value);
  }
  async function getAuthUrl() {
    if (authUrl) return;
    let url = await generateAuthURL();
    if (url) setAuthUrl(url);
  }
  useEffect(() => {
    cookieFn();
    getAuthUrl();
  }, []);

  useEffect(() => {
    if (!authUrl) getAuthUrl();
  }, [inc]);

  function redirect() {
    if (authUrl) {
      return router.push(authUrl);
    } else {
      setInc(inc + 1);
      redirect();
    }
  }

  if (!cookie) {
    return (
      <button
        onClick={redirect}
        className="rounded-md bg-[#6571FF] px-10 py-1.5 text-white"
      >
        Connect with Google Calendar
      </button>
    );
  } else {
    return (
      <div className="flex gap-5">
        <div className="flex items-center gap-2">
          <span className="text-green-500">
            <FaCheck />
          </span>
          <span className="text-[#6571FF]">Connected with Google Calendar</span>
        </div>

        {/* <Link
          href={generateAuthURL()}
          className="rounded-md bg-[#6571FF] px-5 py-1.5 text-white"
        >
          Reconnect
        </Link> */}
      </div>
    );
  }
};

export default ConnectGoogle;
