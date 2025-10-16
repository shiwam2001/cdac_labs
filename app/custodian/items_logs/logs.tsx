"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ItemType = {
  id: number;
  assignedUserId: number;
  custodianName: string;
  dateNow: Date;
  quantity: number | null;
  dateTill: Date | null;
  departmentId: number;
  deviceNumber: string | null;
  deviceType: string;
  labId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  lab: {
    labId: number;
    labNumber: number | null;
    labName: string | null;
    custodianName: string | null;
    createdAt: Date;
    departmentId: number;
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
  department: {
    departmentId: number;
    department_Name: string;
  };
};

type LogsProps = {
  items: ItemType[];
};

const Logs: React.FC<LogsProps> = ({ items }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"approved" | "pending" | "rejected">("approved");

  // 🔎 Filter function
  const filterItems = (list: ItemType[]) =>
    list.filter(
      (item) =>
        item.deviceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lab.labName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Split data by status
  const approvedItems = items.filter((item) => item.status === "APPROVED");
  const rejectedItems = items.filter((item) => item.status === "REJECTED");
  const pendingItems = items.filter((item) => item.status === "PENDING");

  // 📥 Download only for active tab
  const handleDownload = () => {
    let list: ItemType[] = [];

    if (activeTab === "approved") list = approvedItems;
    else if (activeTab === "pending") list = pendingItems;
    else if (activeTab === "rejected") list = rejectedItems;

    const filtered = filterItems(list);

    if (filtered.length === 0) {
      alert(`No ${activeTab} logs to download`);
      return;
    }

    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Sr. No.", "Device ID", "Device Number", "Device Type", "Department", "Lab", "Quantity", "Assigned By", "Custodian", "Status"]],
      body: filtered.map((item, index) => [
        index + 1,
        item.id,
        item.deviceNumber,
        item.deviceType,
        item.department.department_Name,
        item.lab.labName,
        item.quantity,
        item.assignedBy.name,
        item.custodianName,
        item.status,
      ]),
    });

    doc.save(`${activeTab}-logs.pdf`);
  };

  // 🔄 Table render
  const renderTable = (list: ItemType[], label: string) => {
    const filtered = filterItems(list);
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr No.</TableHead>
            <TableHead>Device ID</TableHead>
            <TableHead>Device Number</TableHead>
            <TableHead>Device Type</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Lab</TableHead>
            <TableHead>Custodian</TableHead>
            <TableHead>Assigned By</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date Assigned</TableHead>
            <TableHead>Date Till</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-gray-500">
                No {label.toLowerCase()} logs found
              </TableCell>
            </TableRow>
          )}
          {filtered.map((item,index) => (
            <TableRow key={item.id}>
              <TableCell>{index+1}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.deviceNumber}</TableCell>
              <TableCell>{item.deviceType}</TableCell>
              <TableCell>{item.department.department_Name}</TableCell>
              <TableCell>{item.lab.labName || "N/A"}</TableCell>
              <TableCell>{item.lab.custodianName || "N/A"}</TableCell>
              <TableCell>{item.assignedBy.name}</TableCell>
              <TableCell>{item.assignedBy.email}</TableCell>
              <TableCell>{item.dateNow.toLocaleDateString()}</TableCell>
              <TableCell>{item.dateTill ? item.dateTill.toLocaleDateString() : "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="mt-2 h-screen shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Item Logs</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="approved" value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="flex w-full flex-col">
          <div className="flex justify-between gap-5">
            <TabsList className="mb-4 flex justify-between">
              <TabsTrigger value="approved">Approved Logs</TabsTrigger>
              <TabsTrigger value="rejected">Rejected Logs</TabsTrigger>
              <TabsTrigger value="pending">Pending Logs</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <Button onClick={handleDownload}>Download</Button>
            </div>
          </div>

          <TabsContent value="approved">{renderTable(approvedItems, "Approved")}</TabsContent>
          <TabsContent value="rejected">{renderTable(rejectedItems, "Rejected")}</TabsContent>
          <TabsContent value="pending">{renderTable(pendingItems, "Pending")}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Logs;
