"use client";
import Title from "@/components/Title";
import { FaExternalLinkAlt } from "react-icons/fa";
import { PiLinkFill } from "react-icons/pi";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    month: "Jan",
    leads: 600,
  },
  {
    month: "Feb",
    leads: 200,
  },
  {
    month: "Mar",
    leads: 400,
  },
  {
    month: "Apr",
    leads: 200,
  },
  {
    month: "May",
    leads: 800,
  },
  {
    month: "May",
    leads: 300,
  },
  {
    month: "May",
    leads: 900,
  },
];
export default function Page() {
  return (
    <div className="p-8">
      <Title>Dashboard</Title>
      <div className="grid grid-cols-4 gap-x-8">
        {/* col 1 */}
        <div className="space-y-12">
          {/* sales pipeline */}
          <div className="rounded-md p-8 shadow-lg">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-3xl font-bold">Sales Pipeline</span>{" "}
              <span>
                <FaExternalLinkAlt />
              </span>
            </div>
            <div className="#px-4">
              <DataComponent
                heading="Leads coming in"
                subHeading="/month"
                number={567}
              />
              <DataComponent heading="Leads Converted" number={767} />
              <DataComponent
                heading="Conversion Rate"
                subHeading="Leads Converted/Total Leads"
                number={435}
              />
            </div>
          </div>
          {/* Shop pipeline */}
          <div className="rounded-md p-8 shadow-lg">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-3xl font-bold">Sales Pipeline</span>{" "}
              <span>
                <FaExternalLinkAlt />
              </span>
            </div>
            <div className="#px-4">
              <DataComponent
                heading="Leads coming in"
                subHeading="/month"
                number={567}
              />
              <DataComponent heading="Leads Converted" number={767} />
              <DataComponent
                heading="Conversion Rate"
                subHeading="Leads Converted/Total Leads"
                number={435}
              />
            </div>
          </div>
        </div>
        {/* col 2 */}
        <div></div>
        {/* col 3 */}
        <div></div>
        {/* col 4 */}
        <div></div>
      </div>
    </div>
  );
}

const DataComponent = ({ heading, subHeading, number }: any) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-bold">{heading}</h3>
        {subHeading && <h6 className="text-xs">{subHeading}</h6>}
        <div className="mt-4">
          <span className="text-4xl font-bold"> {number}</span>
        </div>
      </div>
      <div>
        <div>
          <RevenueLineChartContainer />
        </div>
      </div>
    </div>
  );
};

function RevenueLineChartContainer() {
  return (
    <div className="">
      <div style={{ width: "100%" }}>
        <ResponsiveContainer width={200} height={150}>
          <LineChart data={data}>
            <XAxis tick={false} dataKey="month">
              {/* <Label
                angle={-360}
                value="Number of Jobs"
                position="insideBottomRight"
                style={{
                  textAnchor: "end",
                  fontWeight: "bold",
                }}
              >
                Day
              </Label> */}
            </XAxis>
            {/* <YAxis
              dataKey="leads"
              stroke="#fffff"
              tickCount={8}
              domain={[0, "dataMax"]}
            /> */}
            <Tooltip />
            {/* <CartesianGrid
              stroke="#9ca3af"
              verticalCoordinatesGenerator={() => []}
            /> */}
            <Line
              dataKey="leads"
              stroke="#03A7A2"
              strokeWidth="4px"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
