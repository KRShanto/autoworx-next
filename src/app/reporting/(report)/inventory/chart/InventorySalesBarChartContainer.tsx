"use client";
import BarChartComponent from "@/app/reporting/components/BarChartComponent";
import { Bar, Label, Tooltip, XAxis, YAxis } from "recharts";

const CustomBar = (props: any) => {
  const { x, y, width, height, fill, style } = props;
  return (
    <rect
      x={x}
      y={y - 30}
      width={width}
      height={height}
      fill={fill}
      style={style}
    />
  );
};

const CustomLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text
      x={x + width / 2}
      y={y - 35}
      fill="#66738C"
      textAnchor="middle"
      dy={-6}
    >
      {value}
    </text>
  );
};
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { payload: data } = payload[0];
    return (
      <div className="w-36 rounded-lg border border-black bg-white p-4 text-[#03A7A2]">
        <p className="text-xl">{data?.categoryName}</p>
        <p className="text-2xl">${data?.salePrice}</p>
      </div>
    );
  }

  return null;
};

type TProps = {
  salesData: {
    categoryName: string | undefined;
    salePrice: number;
  }[];
};
export default function InventorySalesBarChartContainer({ salesData }: TProps) {
  return (
    <div className="chart-container border-none">
      <BarChartComponent height={500} title="" data={salesData}>
        <XAxis tick={false} dataKey={"categoryName"}>
          <Label
            angle={-360}
            value="Number of Jobs"
            position="insideBottomRight"
            style={{
              textAnchor: "end",
              fontWeight: "bold",
            }}
          >
            Category
          </Label>
        </XAxis>
        <Tooltip cursor={{ fill: "transparent" }} content={<CustomTooltip />} />
        <YAxis tick={false} dataKey={"salePrice"}>
          <Label
            angle={270}
            value="Number of Jobs"
            position="insideTopRight"
            y="70"
            style={{
              textAnchor: "end",
              transform: "rotate(270deg) translate(-110px, -25px)",
              fontWeight: "bold",
            }}
          >
            Category
          </Label>
        </YAxis>
        <Bar
          dataKey={"salePrice"}
          fill="#ffffff"
          style={{ stroke: "#03A7A2", strokeWidth: 2 }}
          shape={<CustomBar />}
          label={<CustomLabel />}
        />
      </BarChartComponent>
    </div>
  );
}
