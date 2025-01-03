import React from "react";
import {
  Bar,
  BarChart,
  Label,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  return <rect x={x} y={y - 10} width={width} height={height} fill={fill} />;
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

interface BarChartComponentProps {
  height: number | string;
  title: string;
  boldTitle?: boolean;
  noYLabel?: boolean;
  data?: { category: string; jobs: number }[] | undefined;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  height,
  title,
  boldTitle = false,
  noYLabel = false,
  data = [],
}) => {
  return (
    <div
      className={`${boldTitle && "my-8 text-xl font-semibold"}`}
      style={{ width: "100%" }}
    >
      <h2
        className={`${boldTitle && "my-8 text-xl font-semibold"}`}
        style={{ marginLeft: "35px" }}
      >
        {title}
      </h2>
      <ResponsiveContainer width="90%" height={height}>
        <BarChart
          data={data}
          margin={{
            top: 55,
            bottom: 5,
          }}
        >
          <XAxis dataKey="category" />
          <YAxis tick={false}>
            {!noYLabel && (
              <Label
                angle={-360}
                value="Number of Jobs"
                position="top"
                offset={20}
                style={{
                  textAnchor: "middle",
                  transform: "translateX(20px)",
                }}
              >
                Jobs
              </Label>
            )}
          </YAxis>
          <Bar
            dataKey="jobs"
            fill="#03A7A2"
            shape={<CustomBar />}
            label={<CustomLabel />}
          ></Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
