'use client'

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ItemTypes } from "./pieChart";

type LogsProps = {
  itemDetails: ItemTypes[];
};

export default function DeviceTypeChart({ itemDetails }: LogsProps) {
  // Aggregate device counts by type
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    itemDetails.forEach((item) => {
      const type = item.deviceType || "Unknown";
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([type, count]) => ({
      deviceType: type,
      count,
    }));
  }, [itemDetails]);

  return (
    <div className="bg-white p-4 rounded-2xl w-full shadow-md h-[330px]">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Device Type Distribution
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="deviceType" />

          {/* ✅ Y-axis auto-adjusting with 10-step ticks */}
          <YAxis
            domain={[0, (dataMax: number) => Math.ceil(dataMax / 10) * 10]}
            tickCount={6}
            tickFormatter={(value) => `${value}`}
          />

          <Tooltip />
          <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

