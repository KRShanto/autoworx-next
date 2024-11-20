import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const ChartData = ({
  heading,
  subHeading,
  number = 0,
  dollarSign = false,
  columnView = false,
  largeChart = false,
  rate = 0,
  isPositive = true,
  noRate = false,
  isNumberPercent = false,
}: any) => {
  return (
    <div
      className={`${columnView ? "flex flex-col" : "flex items-center justify-between gap-x-1"} mb-4`}
    >
      <div>
        <h3 className="text-xs font-bold">{heading}</h3>
        {subHeading && <h6 className="#xl:text-sm text-xs">{subHeading}</h6>}
        <div className="#xl:mt-4 mt-2">
          <span className="text-lg font-bold xl:text-2xl">
            {dollarSign && "$"}
            {number}
            {isNumberPercent && "%"}
          </span>
        </div>
      </div>
      {!noRate && (
        <div className="flex items-center gap-4">
          {rate != 0 &&
            (isPositive ? (
              <div className="text-[#4DB6AC]">
                <FaCaretUp />
              </div>
            ) : (
              <div className="text-red-500">
                <FaCaretDown />
              </div>
            ))}
          <div
            className={`text-2xl font-bold ${rate !== 0 && (isPositive ? "text-[#4DB6AC]" : "text-red-500")}`}
          >
            {rate}%
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartData;
