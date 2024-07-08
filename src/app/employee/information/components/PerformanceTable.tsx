
import { CiCircleInfo } from "react-icons/ci";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

import BarChartComponent from "./BarChartComponent";





interface AttendanceData {
  day: string;
  clockedIn: string;
  clockedOut: string;
  hours: string;
}

interface MetricData {
  label: string;
  value: string;
  percentage: number;
  isPositive: boolean;
}


const metricData: MetricData[] = [
  { label: "Average Time to Complete a Job", value: "45 Hours", percentage: 4, isPositive: true },
  { label: "Return Work Rate by Service Category", value: "45%", percentage: -4, isPositive: false }
  
];
export default function PerformanceTable() {
  return (

    <div className='flex flex-col w-1/2 h-full '>
      <h2 className=" text-xl font-bold mb-2">Performance</h2>
    <div className="flex    gap-4">
      {/* First Half */}
      <div className="w-1/2 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
            {metricData.map((metric, index) => (
              <div key={index} className="flex items-center justify-center gap-4 rounded-lg border border-gray-300 bg-white p-4 relative">
                <button><CiCircleInfo className="absolute left-1 top-0 w-3 h-3" /></button>
                <div className=" w-[80%] text-lg font-bold text-gray-700">{metric.label}</div>
                <div className="w-[80%] text-xl font-semibold text-gray-800">{metric.value}</div>
                <div className={`flex items-center gap-1 text-sm font-medium ${metric.isPositive ? "text-green-500" : "text-red-500"}`}>
                  <div>
                    {metric.isPositive ? (
                      <IoMdArrowDropup />
                    ) : (
                      <IoMdArrowDropdown />
                    )}
                  </div>
                  <div>{Math.abs(metric.percentage)}%</div>
                </div>
              </div>
            ))}
          </div>
        <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 ">
          <BarChartComponent/>
          
        </div>
        <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4">
          <h2 className="text-lg font-bold text-gray-700">Section 3</h2>
          {/* Content for Section 3 */}
        </div>
      </div>
      {/* Second Half */}
      <div className="w-1/2 flex flex-col gap-4">
        <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4">
          <h2 className="text-lg font-bold text-gray-700">Section 4</h2>
          {/* Content for Section 4 */}
        </div>
        <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4">
          <h2 className="text-lg font-bold text-gray-700">Section 5</h2>
          {/* Content for Section 5 */}
          
        </div>
      </div>
    </div>
      
    </div>
  );
}
