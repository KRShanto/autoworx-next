import React from "react";

interface PayoutCardProps {
  title: string;
  amount: number;
  percentage?: string;
  increased?: boolean;
  customStyles?: string;
}

const HorizontalPayoutCard = ({
  title,
  amount,
  percentage,
  increased,
  customStyles,
}: PayoutCardProps) => {
  return (
    <div
      className={`sm: box-border flex items-center gap-x-4 rounded-lg border border-gray-300 bg-white p-5 ${customStyles}`}
    >
      <div className="font-inter text-2xl font-bold text-gray-500">{title}</div>
      <div className="font-inter text-2xl font-semibold text-gray-500">
        ${amount}
      </div>
      {percentage && (
        <div
          className="font-inter text-sm font-semibold"
          style={{
            color: increased ? "#2DCE89" : "#F56565",
          }}
        >
          {percentage}
        </div>
      )}
    </div>
  );
};

export default HorizontalPayoutCard;
