"use client";
import type { DatePickerProps } from "antd";
import { DatePicker } from "antd";
import { info } from "console";
import { CiCircleInfo } from "react-icons/ci";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
// @ts-ignore
import type { Dayjs } from "dayjs";
import { useState } from "react";
import DateRange from "../../../components/DateRange";
import { useParams } from "next/navigation";
import { useServerGet } from "@/hooks/useServerGet";
import { getAttendanceInfo } from "@/actions/employee/getAttendanceInfo";

// const onChange: DatePickerProps<Dayjs[]>["onChange"] = (date, dateString) => {
//   // console.log(date, dateString);
// };

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

interface buttonInfo {
  metricLabel: string;
  content: string;
}

// const attendanceData: AttendanceData[] = [
//   { clockedIn: "9:04AM", clockedOut: "5:00PM", hours: "8" },
//   { clockedIn: "9:00AM", clockedOut: "5:00PM", hours: "8" },
//   { clockedIn: "9:15AM", clockedOut: "5:00PM", hours: "7.75" },
//   { clockedIn: "9:00AM", clockedOut: "5:00PM", hours: "8" },
//   { clockedIn: "9:00AM", clockedOut: "5:00PM", hours: "8" },
//   { clockedIn: "9:30AM", clockedOut: "5:00PM", hours: "7.5" },
//   { clockedIn: "OFF", clockedOut: "OFF", hours: "0" },
// ];

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

//hardcoded data for button info
const infoData: buttonInfo[] = [
  { metricLabel: "Absenteeism", content: "Number of Days Absent" },
  { metricLabel: "Tardiness", content: "Delivered Time - Due Time" },
  {
    metricLabel: "No Show",
    content: "(Total Days Absent/Total Hours Clocked -in) x 100%",
  },
  { metricLabel: "Overtime", content: "Extra Hours Clocked-in" },
  { metricLabel: "Total Hours", content: "Total Hours worked" },
  { metricLabel: "Total Days", content: "Total Days worked" },
];

const Dashboard = () => {
  const [infoIndex, setInfoIndex] = useState<number | null>(null);

  const getInfoContent = (label: string): string | undefined => {
    const info = infoData.find((info) => info.metricLabel === label);
    return info?.content;
  };

  const params = useParams();
  const { data: attendanceInfo } = useServerGet(
    getAttendanceInfo,
    Number(params.id),
  );

  const metricData: MetricData[] = [
    {
      label: "Absenteeism",
      value: `${attendanceInfo?.absentDays} Days`,
      percentage: 4,
      isPositive: true,
    },
    { label: "Tardiness", value: "31 Days", percentage: -4, isPositive: false },
    { label: "No Show", value: "13 Days", percentage: -14, isPositive: false },
    { label: "Overtime", value: "13 Days", percentage: -14, isPositive: false },
    { label: "Total Hours", value: "8 Days", percentage: 24, isPositive: true },
    { label: "Total Days", value: "8 Days", percentage: 24, isPositive: true },
  ];

  // console.log("Attendance info: ", attendanceInfo);

  return (
    <div className="mb-4 box-border flex w-1/2 flex-col">
      <h2 className="mb-2 text-xl font-bold">Attendance</h2>
      <div className="relative flex h-auto w-full flex-col gap-8 rounded border bg-white p-6">
        <div className="absolute left-3 top-3 w-1/6">
          <DateRange
            onOk={(start, end) => {
              /*TODO*/
            }}
            onCancel={() => {
              /*TODO*/
            }}
          />
        </div>

        <div className="flex w-full gap-8 overflow-hidden">
          {/* Attendance Table */}
          <div className="flex w-1/2 min-w-[60%] flex-col gap-4">
            <div className="mt-12 h-full w-full">
              <table className="h-full w-full bg-white text-center">
                <thead>
                  <tr>
                    <th className="border-b bg-white px-4 py-2"></th>
                    <th className="border-b px-4 py-2">Time Clocked In</th>
                    <th className="border-b px-4 py-2">Time Clocked Out</th>
                    <th className="border-b px-4 py-2">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceInfo?.attInfo?.map((data, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-blue-100" : ""}
                    >
                      <td className="border-b bg-white px-4 py-2">
                        {daysOfWeek[index]}
                      </td>
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
          <div className="flex w-1/2 flex-col gap-4">
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
                <div className="w-[70%] text-base font-bold text-gray-700">
                  {metric.label}
                </div>
                <div className="w-[60%] text-lg font-semibold text-gray-800">
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
                    className="absolute -ml-36 w-[150px] rounded-lg p-2 text-center text-sm text-white"
                  >
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
