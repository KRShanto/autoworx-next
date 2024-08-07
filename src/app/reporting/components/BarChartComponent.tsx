"use client";
import React from "react";
import { BarChart, ResponsiveContainer } from "recharts";

interface TProps {
  height: number | string;
  title: string;
  data: Record<string, unknown>[];
  children?: React.ReactNode;
}

export default function BarChartComponent({
  title,
  height,
  data,
  children,
}: TProps) {
  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ marginLeft: "35px" }} className="text-2xl font-bold">
        {title}
      </h2>
      <ResponsiveContainer width="95%" height={height}>
        <BarChart
          data={data}
          margin={{
            top: 55,
            bottom: 5,
          }}
        >
          {children}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
