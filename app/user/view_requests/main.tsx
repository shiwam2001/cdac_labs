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
import { User } from "@prisma/client";
import { ItemType } from "@/app/admin/items_logs/itemsLogs";

// ✅ Define backend data type properly
type TransferRequestType = {
  id: number;
  itemId: number;
  fromDeptId: number;
  toDeptId: number;
  fromLabId: number;
  toLabId: number;
  quantity: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  transferedBy: User | null;
  item: ItemType & {
    assignedBy: User | null;
  };
  fromDepartment: {
    departmentId: number;
    department_Name: string;
  };
  toDepartment: {
    departmentId: number;
    department_Name: string;
  };
  fromLab: {
    labId: number;
    labName: string | null;
    custodian: User | null;
  };
  toLab: {
    labId: number;
    labName: string | null;
    custodian: User | null;
  };
};

// ✅ Props updated
type Props = {
  transferItems: TransferRequestType[];
};

// ✅ Component updated
const TransferRequests: React.FC<Props> = ({ transferItems }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "approved" | "pending" | "rejected"
  >("approved");

  // 🔍 Filter logic
  const filterRequests = (list: TransferRequestType[]) =>
    list.filter(
      (req) =>
        req.item.deviceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.item.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.fromDepartment.department_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.toDepartment.department_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.fromLab.labName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.toLab.labName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Split by status
  const approved = transferItems.filter((r) => r.status === "APPROVED");
  const pending = transferItems.filter((r) => r.status === "PENDING");
  const rejected = transferItems.filter((r) => r.status === "REJECTED");

  // 📄 PDF Download
  const handleDownload = () => {
    let list: TransferRequestType[] = [];
    if (activeTab === "approved") list = approved;
    else if (activeTab === "pending") list = pending;
    else list = rejected;

    const filtered = filterRequests(list);
    if (filtered.length === 0) {
      alert(`No ${activeTab} transfer requests to download`);
      return;
    }

    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "Sr No.",
          "Device ID",
          "Device Number",
          "Device Type",
          "From Dept",
          "To Dept",
          "From Lab",
          "To Lab",
          "Quantity",
          "Requested By",
          "Status",
        ],
      ],
      body: filtered.map((r, i) => [
        i + 1,
        r.item.id,
        r.item.deviceNumber || "N/A",
        r.item.deviceType,
        r.fromDepartment.department_Name,
        r.toDepartment.department_Name,
        r.fromLab.labName || "N/A",
        r.toLab.labName || "N/A",
        r.quantity,
        r.item.assignedBy?.name || r.transferedBy?.name || "N/A",
        r.status,
      ]),
    });
    doc.save(`${activeTab}-transfer-requests.pdf`);
  };

  // 🧾 Table UI
  const renderTable = (list: TransferRequestType[], label: string) => {
    const filtered = filterRequests(list);
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr No.</TableHead>
            <TableHead>Device ID</TableHead>
            <TableHead>Device Number</TableHead>
            <TableHead>Device Type</TableHead>
            <TableHead>From Department</TableHead>
            <TableHead>To Department</TableHead>
            <TableHead>From Lab</TableHead>
            <TableHead>To Lab</TableHead>
            <TableHead>From Custodian</TableHead>
            <TableHead>To Custodian</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={13} className="text-center text-gray-500">
                No {label.toLowerCase()} requests found
              </TableCell>
            </TableRow>
          )}
          {filtered.map((r, i) => (
            <TableRow key={r.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{r.item.id}</TableCell>
              <TableCell>{r.item.deviceNumber || "N/A"}</TableCell>
              <TableCell>{r.item.deviceType}</TableCell>
              <TableCell>{r.fromDepartment.department_Name}</TableCell>
              <TableCell>{r.toDepartment.department_Name}</TableCell>
              <TableCell>{r.fromLab.labName || "N/A"}</TableCell>
              <TableCell>{r.toLab.labName || "N/A"}</TableCell>
              <TableCell>{r.fromLab.custodian?.name || "N/A"}</TableCell>
              <TableCell>{r.toLab.custodian?.name || "N/A"}</TableCell>
              <TableCell>{r.quantity}</TableCell>
              <TableCell>{r.item.assignedBy?.name || r.transferedBy?.name || "N/A"}</TableCell>
              <TableCell>{r.status}</TableCell>
              <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="mt-2 h-screen shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Transfer Requests</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue="approved"
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as any)}
          className="flex w-full flex-col"
        >
          <div className="flex justify-between gap-5">
            <TabsList className="mb-4 flex justify-between">
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={handleDownload}>Download</Button>
            </div>
          </div>

          <TabsContent value="approved">{renderTable(approved, "Approved")}</TabsContent>
          <TabsContent value="rejected">{renderTable(rejected, "Rejected")}</TabsContent>
          <TabsContent value="pending">{renderTable(pending, "Pending")}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TransferRequests;

