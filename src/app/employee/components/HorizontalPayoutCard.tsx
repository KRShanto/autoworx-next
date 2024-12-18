import React from "react";

interface PayoutCardProps {
  title: string;
  amount: number;
  percentage?: number;
  increased?: boolean;
  customStyles?: string;
}

const HorizontalPayoutCard = ({
  title,
  amount,
  percentage = 0,
  increased,
  customStyles,
}: PayoutCardProps) => {
  return (
    <div
      className={`sm: box-border flex items-center gap-x-4 rounded-lg border border-gray-300 bg-white p-5 ${customStyles}`}
    >
      <div className="font-inter font-bold text-gray-500 lg:text-2xl">
        {title}
      </div>
      <div className="font-inter font-semibold text-gray-500 lg:text-2xl">
        ${amount}
      </div>
      {percentage != 0 && (
        <div
          className="font-inter text-sm font-semibold"
          style={{
            color: increased ? "#2DCE89" : "#F56565",
          }}
        >
          {percentage}%
        </div>
      )}
      {percentage == 0 && (
        <div className="font-inter text-2xl font-semibold lg:text-4xl">-</div>
      )}
    </div>
  );
};

export default HorizontalPayoutCard;
