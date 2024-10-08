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
  columnView = false,
  largeChart = false,
}: any) => {
  return (
    <div
      className={`mb-8 ${columnView ? "flex flex-col" : "flex items-start justify-between gap-x-1"}`}
    >
      <div>
        <h3 className="text-sm font-bold">{heading}</h3>
        {subHeading && <h6 className="#xl:text-sm text-xs">{subHeading}</h6>}
        <div className="mt-2 xl:mt-4">
          <span className="text-2xl font-bold xl:text-4xl">
            {" "}
            {dollarSign && "$"}
            {number}
          </span>
        </div>
      </div>
      <div>
        <div className="">
          <RevenueLineChartContainer largeChart={largeChart} />
        </div>
      </div>
    </div>
  );
};

function RevenueLineChartContainer({ largeChart }: { largeChart: boolean }) {
  return (
    <div className="">
      <div style={{ width: "100%" }}>
        <ResponsiveContainer
          width={largeChart ? "80%" : 100}
          height={largeChart ? 120 : 70}
        >
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
