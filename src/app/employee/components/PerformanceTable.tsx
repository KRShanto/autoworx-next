import { CiCircleInfo } from "react-icons/ci";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useState } from "react";
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
    label: "Average Time to Complete a Job",
    value: "45 Hours",
    percentage: 4,
    isPositive: true,
  },
  {
    label: "Return Work Rate by Service Category",
    value: "45%",
    percentage: -4,
    isPositive: false,
  },
];

const arrayOfPerformanceWord = ["Average", "Return"];

export default function PerformanceTable() {
  const [infoIndex, setInfoIndex] = useState<number | null>(null);

  const getPerformanceContent = (label: string): string | undefined => {
    // console.log(label);
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
    <div className="flex h-full w-1/2 flex-col  mb-4">
      <h2 className="mb-2 text-xl font-bold">Performance</h2>
      <div className="flex gap-4">
        {/* First Half */}
        <div className="flex w-1/2 flex-col gap-2">
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
          <div className="flex-shrink rounded-lg border border-gray-300 bg-white p-" style={{ height: '60%' }}>
            {/* //bar chart will be here */}
            <BarChartComponent height={300} title="Total Number of Jobs Assigned"/>
            
          </div>
         
        </div>
        {/* Second Half */}
        <div className="flex w-1/2 flex-col gap-4">
          <div className="flex-shrink rounded-lg border border-gray-300 bg-white p-2 " style={{ height: '50%' }}>
            
            <BarChartComponent height={230} title="Total Number of Jobs Completed on Time"/>
          </div>
          <div className="flex-shrink rounded-lg border border-gray-300 bg-white p-2" style={{ height: '50%' }}>
           
            <BarChartComponent height={230} title="Total Number of Jobs Completed Late"/>
          </div>
        </div>
      </div>
    </div>
  );
}
