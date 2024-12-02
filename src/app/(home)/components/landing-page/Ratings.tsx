import React from "react";
import { IoIosStar } from "react-icons/io";

export default function Ratings({ ratings }: { ratings: number }) {
  return (
    <div className="flex items-center gap-x-3">
      {[...Array(ratings)].map((_, index) => (
        <div key={index}>
          <svg
            width="46"
            height="44"
            viewBox="0 0 46 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23 0L28.3883 16.5836H45.8254L31.7185 26.8328L37.1068 43.4164L23 33.1672L8.89315 43.4164L14.2815 26.8328L0.174644 16.5836H17.6117L23 0Z"
              fill="url(#paint0_linear_14_149)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_14_149"
                x1="23"
                y1="0"
                x2="23"
                y2="48"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#26AADF" />
                <stop offset="1" stop-color="#01A79E" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}
