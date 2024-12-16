import { useEffect, useRef, useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import BarChartComponent from "./BarChartComponent";

interface AttendanceData {
  day: string;
  clockedIn: string;
  clockedOut: string;
  hours: string;
}

interface buttonInfo {
  metricLabel: string;
  content: string;
}

interface MetricData {
  label: string;
  value: string;
  percentage: number;
  isPositive: boolean;
}

const metricData: MetricData[] = [
  {
    label: "Average Sales Cycle Length",
    value: "45 Hours",
    percentage: 4,
    isPositive: true,
  },
  {
    label: "Average Deal Size",
    value: "45%",
    percentage: -4,
    isPositive: false,
  },
  {
    label: "Win Loss Rate",
    value: "45%",
    percentage: -4,
    isPositive: false,
  },
];

const arrayOfPerformanceWord = ["Average", "Return"];

export default function SalesPerformanceTable() {

  const [infoIndex, setInfoIndex] = useState<number | null>(null);
 
  const getPerformanceContent = (label: string): string | undefined => {
    const labelword = label.split(" ");
    for (const word of labelword) {
      if (arrayOfPerformanceWord.includes(word)) {
        if (word === "Average") {
          return "Average Time to Complete a Job";
        } else if (word === "Return") {
          return "(Return Work/TotalWork)x100%";
        }
      }
      return undefined;
    }
  };

  return (
    <div className="mb-4 flex h-full w-full flex-col">
      <h2 className="mb-2 text-xl font-bold">Performance</h2>
      <div className="flex gap-8">
        {/* First Half */}
        <div  className="flex w-[30%] flex-col gap-6">
          <div className="flex flex-col gap-4">
            {metricData.map((metric, index) => (
              <div
                key={index}
                className="relative flex items-center justify-center gap-4 rounded-lg border border-gray-300 bg-white p-4"
              >
                <button
                  onClick={() =>
                    setInfoIndex(infoIndex === index ? null : index)
                  }
                >
                  <CiCircleInfo className="absolute left-1 top-0 h-3 w-3" />
                </button>
                <div className="w-[80%] text-lg font-bold text-gray-700">
                  {metric.label}
                </div>
                <div className="w-[80%] text-xl font-semibold text-gray-800">
                  {metric.value}
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${metric.isPositive ? "text-green-500" : "text-red-500"}`}
                >
                  <div>
                    {metric.isPositive ? (
                      <IoMdArrowDropup />
                    ) : (
                      <IoMdArrowDropdown />
                    )}
                  </div>
                  <div>{Math.abs(metric.percentage)}%</div>
                </div>

                {infoIndex === index && (
                  <div
                    style={{ backgroundColor: "rgba(102, 115, 140, 0.9)" }}
                    className="absolute -ml-36 flex h-[80px] w-[250px] items-center justify-center rounded-lg p-2 text-sm text-white"
                  >
                    {getPerformanceContent(metric.label)}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            className="p- flex-shrink rounded-lg border border-gray-300 bg-white"
            style={{ height: "60%" }}
          >
            {/* //bar chart will be here */}
            <BarChartComponent height={300} title="Leads Converted Per Month" />
          </div>
        </div>
        {/* Second Half */}
        {/* <div className="flex gap-4"> */}
        <div className="w-[35%] flex-shrink rounded-lg border border-gray-300 bg-white p-2">
          <BarChartComponent
            noYLabel
            height={400}
            title="Sales Activity"
            boldTitle
          />
        </div>
        <div className="w-[35%] flex-shrink rounded-lg border border-gray-300 bg-white p-2">
          <BarChartComponent
            height={400}
            title="Opportunity Conversion Rate"
            boldTitle
          />
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
