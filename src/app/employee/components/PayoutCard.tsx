import { cn } from "@/lib/cn";
import React from "react";

interface PayoutCardProps {
  title: string;
  amount: number;
  percentage?: number;
  increased?: boolean;
  customStyles?: string;
}

const PayoutCard = ({
  title,
  amount,
  percentage = 0,
  increased,
  customStyles,
}: PayoutCardProps) => {
  return (
    <div
      className={`sm: box-border h-full w-full rounded-lg border border-gray-300 bg-white p-5 text-sm ${customStyles}`}
    >
      <div className="font-inter mb-4 w-[300px] text-xl font-bold text-gray-500">
        {title}
      </div>
      <div className="font-inter mb-4 text-6xl font-semibold text-gray-500">
        ${amount}
      </div>
      {percentage != 0 && (
        <div
          className={cn(
            "font-inter text-xl font-semibold",
            increased ? "text-green-500" : "text-red-500",
          )}
        >
          {percentage}%
        </div>
      )}
      {percentage == 0 && (
        <div className="font-inter text-4xl font-semibold">-</div>
      )}
    </div>
  );
};

export default PayoutCard;
