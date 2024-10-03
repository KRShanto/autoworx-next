"use client";
import BarChartComponent from "@/app/reporting/components/BarChartComponent";
import { Bar, Tooltip, XAxis, YAxis } from "recharts";



const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  return (
    <rect
      x={x}
      y={y - 25}
      width={width}
      height={height}
      fill={fill}
      rx={5}
      ry={5}
    />
  );
};

const CustomLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text
      x={x + width / 2}
      y={y - 25}
      fill="#66738C"
      textAnchor="middle"
      dy={-6}
    >
      ${value}
    </text>
  );
};
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { payload: data } = payload[0];
    return (
      <div className="w-56 rounded-lg border border-black bg-white p-4 text-[#03A7A2]">
        <p className="text-xl">{data?.method}</p>
        <p className="text-2xl">${data?.payment}</p>
      </div>
    );
  }

  return null;
};


type TProps = {
  paymentData: Array<{ method: string; payment: number }>;
}

export default function PaymentBarChartContainer({paymentData}: TProps) {
  return (
    <div className="chart-container">
      <BarChartComponent height={500} title="" data={paymentData}>
        <XAxis
          tickLine={false}
          dataKey={"method"}
          style={{ fontSize: "18px", fontWeight: "600" }}
        />
        <YAxis tick={false} />
        <Bar
          dataKey={"payment"}
          fill="#03A7A2"
          shape={<CustomBar />}
          label={<CustomLabel />}
        />
        <Tooltip cursor={{ fill: "transparent" }} content={<CustomTooltip />} />
      </BarChartComponent>
    </div>
  );
}
