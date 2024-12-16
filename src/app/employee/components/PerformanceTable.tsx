import { CiCircleInfo } from "react-icons/ci";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useState } from "react";
import BarChartComponent from "./BarChartComponent";
import { useParams } from "next/navigation";
import { useServerGet } from "@/hooks/useServerGet";
import { getPerformanceInfo } from "@/actions/employee/getPerformanceInfo";
import { cn } from "@/lib/cn";

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
  isZeroGrowth: boolean;
}

const arrayOfPerformanceWord = ["Average", "Return"];

export default function PerformanceTable() {
  const params = useParams();
  const { data } = useServerGet(getPerformanceInfo, Number(params.id));
  const {
    averageJobTime,
    averageJobTimeGrowthRate,
    returnWorkRate,
    returnWorkRateGrowthRate,
    totalJobs,
    totalJobsCompletedOnTime,
    totalJobsCompletedLate,
  } = data || {};

  console.log("Average Job Time: ", averageJobTime);
  console.log("Return Work Rate: ", returnWorkRate);
  console.log("Total Jobs: ", totalJobs);
  console.log("Total Jobs Completed On Time: ", totalJobsCompletedOnTime);
  console.log("Total Jobs Completed Late: ", totalJobsCompletedLate);

  const [infoIndex, setInfoIndex] = useState<number | null>(null);

  const metricData: MetricData[] = [
    {
      label: "Average Time to Complete a Job",
      value: Math.floor(averageJobTime || 0) + " hours",
      percentage: averageJobTimeGrowthRate!,
      isPositive: (averageJobTimeGrowthRate || 0) > 0,
      isZeroGrowth: averageJobTimeGrowthRate === 0,
    },
    {
      label: "Return Work Rate by Service Category",
      // value: returnWorkRate + "%",
      value: Math.floor(returnWorkRate || 0) + "%",
      percentage: returnWorkRateGrowthRate!,
      isPositive: (returnWorkRateGrowthRate || 0) > 0,
      isZeroGrowth: returnWorkRateGrowthRate === 0,
    },
  ];

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
    <div className="mb-4 flex h-full w-1/2 flex-col">
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
                {!metric.isZeroGrowth && (
                  <div
                    className={cn(
                      "font-inter text-xl font-semibold",
                      metric.percentage ? "text-green-500" : "text-red-500",
                    )}
                  >
                    {metric.percentage}%
                  </div>
                )}
                {metric.isZeroGrowth && (
                  <div className="font-inter text-4xl font-semibold">-</div>
                )}

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
            <BarChartComponent
              height={300}
              title="Total Number of Jobs Assigned"
              data={totalJobs?.map((job) => ({
                category: job.categoryName,
                jobs: job.count,
              }))}
            />
          </div>
        </div>
        {/* Second Half */}
        <div className="flex w-1/2 flex-col gap-4">
          <div
            className="flex-shrink rounded-lg border border-gray-300 bg-white p-2"
            style={{ height: "50%" }}
          >
            <BarChartComponent
              height={230}
              title="Total Number of Jobs Completed on Time"
              data={totalJobsCompletedOnTime?.map((job) => ({
                category: job.categoryName,
                jobs: job.count,
              }))}
            />
          </div>
          <div
            className="flex-shrink rounded-lg border border-gray-300 bg-white p-2"
            style={{ height: "50%" }}
          >
            <BarChartComponent
              height={230}
              title="Total Number of Jobs Completed Late"
              data={totalJobsCompletedLate?.map((job) => ({
                category: job.categoryName,
                jobs: job.count,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
