"use client";
import React, { useMemo } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

export type User = {
  id: number;
  name: string;
  employeeId: string;
  email: string;
  role: string;
  createdAt: Date;
};

export type Department = {
  departmentId: number;
  department_Name: string;
  labs: any[];
};

export type ItemTypes = {
  id: number;
  assignedUserId: number;
  custodianName: string;
  dateNow: Date;
  dateTill: Date | null;
  departmentId: number;
  deviceNumber: string | null;
  quantity: number | null;
  activety: string;
  deviceType: string;
  labId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  lab: {
   departmentId: number;
  createdAt: Date;
  labId: number;
  labNumber: number | null;
  labName: string | null;
  custodianName: string | null;
  custodianId: string | null;
  };
  assignedBy: {
    id: number;
    name: string;
    employeeId: string;
    email: string;
    role: string;
    createdAt: Date;
  };
  department: Department;
};


type LogsProps = {
  itemDetails: ItemTypes[];
};

export default function StatusPieChart({ itemDetails }:LogsProps) {
  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  const data = useMemo(() => {
    const counts:Record<string,number> = {};
    itemDetails.forEach((item) => {
      const status = item.status || "UNKNOWN";
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [itemDetails]);

  return (
    <div className="bg-white p-4 w-full rounded-2xl shadow-md h-[310px]">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Item Status Overview
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
