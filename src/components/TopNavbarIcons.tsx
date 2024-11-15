"use client";
import { signOut } from "next-auth/react";
import { env } from "next-runtime-env";
import { useRouter } from "next/navigation";
import { IoMdLogOut } from "react-icons/io";

export default function TopNavbarIcons() {
  const router = useRouter();
  return (
    <div className="flex items-center gap-x-4">
      <svg
        width="150"
        height="24"
        viewBox="0 0 150 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M85.47 14.1318L84 17.7998L87.668 16.3298C89.0119 17.2538 90.6499 17.7998 92.3999 17.7998C97.0338 17.7998 100.8 14.0338 100.8 9.3999C100.8 4.76596 97.0338 1 92.3999 1C87.766 1 84 4.76596 84 9.3999C84 11.1639 84.532 12.7879 85.47 14.1318Z"
          stroke="#6571FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M103.53 10.7021C104.454 11.8921 105 13.3761 105 15.0001C105 16.4701 104.552 17.828 103.782 18.948L105 22L101.948 20.782C100.828 21.552 99.47 22 98 22C96.376 22 94.892 21.454 93.702 20.53"
          stroke="#6571FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M138.083 10.1667C140.615 10.1667 142.667 8.11464 142.667 5.58333C142.667 3.05203 140.615 1 138.083 1C135.552 1 133.5 3.05203 133.5 5.58333C133.5 8.11464 135.552 10.1667 138.083 10.1667Z"
          stroke="#6571FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M148.167 17.5V22.0833C148.167 22.5967 147.763 23 147.25 23H128.917C128.403 23 128 22.5967 128 22.0833V17.5"
          stroke="#6571FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M128 17.5C133.83 12.605 142.337 12.605 148.167 17.5"
          stroke="#6571FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.6364 3.90909H16.2727C16.68 3.90909 17 4.22909 17 4.63636V22.0909C17 22.4982 16.68 22.8182 16.2727 22.8182H1.72727C1.32 22.8182 1 22.4982 1 22.0909V4.63636C1 4.22909 1.32 3.90909 1.72727 3.90909H5.36364"
          stroke="#6571FF"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
        <path
          d="M10.4546 2.45455C10.4546 1.65455 9.80001 1 9.00001 1C8.20001 1 7.54547 1.65455 7.54547 2.45455H5.36365V5.36364H12.6364V2.45455H10.4546Z"
          stroke="#6571FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 12.6364H3.90909L6.09091 15.5455L9 8.27273L11.9091 18.4545L14.0909 12.6364H17"
          stroke="#6571FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M46.8828 17.2622C46.6394 17.8523 46.5452 18.4932 46.6085 19.1283C46.6718 19.7634 46.8906 20.3732 47.2456 20.9036C47.6006 21.434 48.0808 21.8688 48.6438 22.1695C49.2068 22.4701 49.8352 22.6274 50.4735 22.6274C51.1118 22.6274 51.7402 22.4701 52.3032 22.1695C52.8662 21.8688 53.3464 21.434 53.7014 20.9036C54.0564 20.3732 54.2752 19.7634 54.3385 19.1283C54.4018 18.4932 54.3076 17.8523 54.0642 17.2622H46.8828Z"
          stroke="#6571FF"
          strokeWidth="2"
          strokeLinecap="square"
        />
        <path
          d="M57.2226 13.4954V7.75459C57.224 6.86807 57.0506 5.98996 56.7123 5.17052C56.374 4.35108 55.8775 3.60638 55.2511 2.97902C54.6247 2.35166 53.8808 1.85396 53.0619 1.51438C52.243 1.1748 51.3652 1.00001 50.4787 1.00001C49.5913 0.998603 48.7123 1.17236 47.8921 1.51131C47.072 1.85026 46.3268 2.34774 45.6993 2.97524C45.0718 3.60275 44.5743 4.34792 44.2354 5.16806C43.8964 5.98819 43.7227 6.86717 43.7241 7.75459V13.4954C43.7241 14.4861 43.3328 15.4367 42.6353 16.1401C41.9378 16.8436 40.9906 17.2431 40 17.2515H61C60.5049 17.2543 60.0142 17.1593 59.5561 16.9718C59.0979 16.7843 58.6813 16.508 58.3302 16.159C57.9792 15.8099 57.7006 15.3949 57.5105 14.9378C57.3204 14.4807 57.2226 13.9905 57.2226 13.4954Z"
          stroke="#6571FF"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>
      <button
        onClick={() => {
          signOut({
            callbackUrl:
              env("NEXT_PUBLIC_APP_URL") + "/login" ||
              "https://autoworx.link/login",
          });
        }}
        className="bg-white text-2xl text-[#6571FF]"
      >
        <IoMdLogOut />
      </button>
    </div>
  );
}
