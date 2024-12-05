"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { generateAuthURL, getCookies } from "./getCookie";

type Props = {};

const ConnectGoogle = (props: Props) => {
  const [cookie, setCookie] = useState<string>("");

  async function cookieFn() {
    let Cookie = await getCookies();
    if (Cookie) setCookie(Cookie.value);
  }
  async function getAuthUrls(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await generateAuthURL();
  }

  useEffect(() => {
    cookieFn();
  }, []);

  if (!cookie) {
    return (
      <button
        type="button"
        onClick={getAuthUrls}
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
