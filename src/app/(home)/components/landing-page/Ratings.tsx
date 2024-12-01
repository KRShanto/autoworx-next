import React from "react";
import { IoIosStar } from "react-icons/io";

export default function Ratings({ ratings }: { ratings: number }) {
  return (
    <div>
      {[...Array(ratings)].map((_, index) => (
        <IoIosStar key={index} size={30} />
      ))}
    </div>
  );
}
