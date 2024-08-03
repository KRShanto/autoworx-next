"use client";
import { Bar, Label, XAxis, YAxis } from "recharts";
import PipelineBarChartComponent from "../PipelineBarChartComponent";

const data = [
  {
    month: "Jan",
    leads: 100,
  },
  {
    month: "Feb",
    leads: 200,
  },
  {
    month: "Mar",
    leads: 200,
  },
  {
    month: "Apr",
    leads: 300,
  },
  {
    month: "May",
    leads: 600,
  },
  {
    month: "Jun",
    leads: 100,
  },
  {
    month: "Jul",
    leads: 200,
  },
  {
    month: "Agu",
    leads: 300,
  },
  {
    month: "Sep",
    leads: 400,
  },
  {
    month: "Oct",
    leads: 120,
  },
  {
    month: "Nov",
    leads: 140,
  },
  {
    month: "Dec",
    leads: 300,
  },
];

const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  return (
    <rect
      x={x}
      y={y - 10}
      width={width}
      height={height}
      fill={fill}
      rx="20"
      ry="15"
    />
  );
};

const CustomLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text
      x={x + width / 2}
      y={y - 15}
      fill="#66738C"
      textAnchor="middle"
      dy={-6}
    >
      {value}
    </text>
  );
};
export default function LeadsBarChartContainer() {
  return (
    <div className="chart-container">
      <PipelineBarChartComponent
        height={350}
        title="Total Leads Generated per Month"
        data={data}
      >
        <XAxis tickLine={false} dataKey={"month"} />
        <YAxis tick={false}>
          <Label
            angle={-360}
            value="Number of Jobs"
            position="top"
            offset={20}
            style={{
              textAnchor: "middle",
              transform: "translateX(20px)",
              fontWeight: "bold",
            }}
          >
            Leads
          </Label>
        </YAxis>
        <Bar
          dataKey={"leads"}
          fill="#03A7A2"
          shape={<CustomBar />}
          label={<CustomLabel />}
        />
      </PipelineBarChartComponent>
    </div>
  );
}
