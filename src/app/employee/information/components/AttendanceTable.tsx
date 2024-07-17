"use client";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { CiCircleInfo } from "react-icons/ci";
import type { DatePickerProps } from "antd";
import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import { useState } from "react";
import { info } from "console";
import DateRange from "./DateRange";



const onChange: DatePickerProps<Dayjs[]>["onChange"] = (date, dateString) => {
  // console.log(date, dateString);
};

interface AttendanceData {

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

interface buttonInfo{
  metricLabel: string;
  content: string;
}

const attendanceData: AttendanceData[] = [
  {  clockedIn: "9:04AM", clockedOut: "5:00PM", hours: "8" },
  { clockedIn: "9:00AM", clockedOut: "5:00PM", hours: "8" },
  {  clockedIn: "9:15AM", clockedOut: "5:00PM", hours: "7.75" },
  { clockedIn: "9:00AM", clockedOut: "5:00PM", hours: "8" },
  {  clockedIn: "9:00AM", clockedOut: "5:00PM", hours: "8" },
  { clockedIn: "9:30AM", clockedOut: "5:00PM", hours: "7.5" },
  {  clockedIn: "OFF", clockedOut: "OFF", hours: "0" },
];

const metricData: MetricData[] = [
  { label: "Absenteeism", value: "45 Hours", percentage: 4, isPositive: true },
  { label: "Tardiness", value: "31 Days", percentage: -4, isPositive: false },
  { label: "No Show", value: "13 Days", percentage: -14, isPositive: false },
  { label: "Overtime", value: "13 Days", percentage: -14, isPositive: false },
  { label: "Total Hours", value: "8 Days", percentage: 24, isPositive: true },
  { label: "Total Days", value: "8 Days", percentage: 24, isPositive: true },
];

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

//hardcoded data for button info
const infoData: buttonInfo[] = [
  { metricLabel: "Absenteeism", content: "Number of Days Absent" },
  { metricLabel: "Tardiness", content: "Delivered Time - Due Time" },
  { metricLabel: "No Show", content: "(Total Days Absent/Total Hours Clocked -in) x 100%" },
  { metricLabel: "Overtime", content: "Extra Hours Clocked-in" },
  { metricLabel: "Total Hours", content: "Total Hours worked" },
  { metricLabel: "Total Days", content: "Total Days worked" },
];

const Dashboard = () => {

  const [infoIndex, setInfoIndex] = useState<number | null>(null);

  const getInfoContent = (label: string): string | undefined => {
    const info = infoData.find(info => info.metricLabel === label);
    return info?.content;
  };

  return (
    <div className="flex flex-col w-1/2 box-border mb-4 ">
      <h2 className=" text-xl font-bold mb-2">Attendance</h2>
      < div className="relative flex flex-col w-full h-auto rounded border bg-white p-6  gap-8 ">
        <div className="absolute left-3 top-3 w-1/6">
        <DateRange />
          
        </div>

        <div className="flex w-full gap-8 overflow-hidden">
          {/* Attendance Table */}
          <div className="w-1/2 flex flex-col gap-4 min-w-[60%] ">
            <div className="w-full h-full mt-12">
              <table className="w-full h-full bg-white text-center">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2 bg-white"></th>
                    <th className="border-b px-4 py-2">Time Clocked In</th>
                    <th className="border-b px-4 py-2">Time Clocked Out</th>
                    <th className="border-b px-4 py-2">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((data, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-blue-100" : ""}>
                      <td className="border-b px-4 py-2 bg-white">{daysOfWeek[index]}</td>
                      <td className="border-b px-4 py-2">{data.clockedIn}</td>
                      <td className="border-b px-4 py-2">{data.clockedOut}</td>
                      <td className="border-b px-4 py-2">{data.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Metrics Section */}
          <div className="w-1/2 flex flex-col gap-4">
            {metricData.map((metric, index) => (
              <div key={index} className="flex items-center justify-center gap-4 rounded-lg border border-gray-300 bg-white p-4 relative">
                <button onClick={() => setInfoIndex(infoIndex === index ? null : index)}><CiCircleInfo className="absolute left-1 top-0 w-3 h-3" /></button>
                <div className="w-[70%] text-lg font-bold text-gray-700">{metric.label}</div>
                <div className="w-[60%] text-xl font-semibold text-gray-800">{metric.value}</div>
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

                {infoIndex === index && (
                  <div style={{ backgroundColor: 'rgba(102, 115, 140, 0.9)' }}  className="absolute  text-white text-sm p-2 rounded-lg w-[150px] text-center  -ml-36 ">
                    {getInfoContent(metric.label)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
