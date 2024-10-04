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

const ChartData = ({
  heading,
  subHeading,
  number,
  dollarSign = false,
}: any) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-bold">{heading}</h3>
        {subHeading && <h6 className="text-xs">{subHeading}</h6>}
        <div className="mt-4">
          <span className="text-4xl font-bold">
            {" "}
            {dollarSign && "$"}
            {number}
          </span>
        </div>
      </div>
      <div>
        <div className="scale-[0.7]">
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

export default ChartData;
