"use client";

import React, { useState, useEffect } from "react";
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
import { Action, Department, User } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ItemType = {
  id: number;
  assignedUserId: number|null;
  custodianName: string;
  dateNow: Date;   // 👈 wapas Date
  dateTill: Date | null;
  departmentId: number;
  deviceNumber: string | null;
  quantity: number | null;
  activety: string;
  deviceType: string;
  labId: number;
  status:Action
  lab: {
    labId: number;
    labNumber: number | null;
    labName: string | null;
    createdAt: Date;
    custodian: User | null;
    custodianId: string | null;
  };
  assignedBy: User | null;
  transferedBy: User | null;
  department: Department;
};
 

type LogsProps = {
  items: ItemType[];
};

const Logs: React.FC<LogsProps> = ({ items }) => {
  const [clientLoaded, setClientLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "approved" | "pending" | "rejected"
  >("approved");

  useEffect(() => {
    setClientLoaded(true);
  }, []);

  const filterItems = (list: ItemType[]) =>
    list.filter(
      (item) =>
        item.deviceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lab.labName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignedBy?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const approvedItems = items.filter((item) => item.status === "APPROVED");
  const rejectedItems = items.filter((item) => item.status === "REJECTED");
  const pendingItems = items.filter((item) => item.status === "PENDING");

  const handleDownload = async () => {
    let list: ItemType[] = [];
    if (activeTab === "approved") list = approvedItems;
    else if (activeTab === "rejected") list = rejectedItems;
    else if (activeTab === "pending") list = pendingItems;

    const filtered = filterItems(list);

    if (filtered.length === 0) {
      alert(`No ${activeTab} logs to download`);
      return;
    }

    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "Sr. No.",
          "Device ID",
          "Device Number",
          "Device Type",
          "Department",
          "Lab",
          "Quantity",
          "Assigned By",
          "Custodian",
          "Status",
        ],
      ],
      body: filtered.map((item, index) => [
  index + 1,
  item.id ?? "",
  item.deviceNumber ?? "",
  item.deviceType ?? "",
  item.department?.department_Name ?? "",
  item.lab?.labName ?? "",
  item.quantity ?? "",
  item.assignedBy?.name ?? item.transferedBy?.name ?? "",
  item.custodianName ?? "",
  item.status ?? "",
]),

    });

    doc.save(`${activeTab}-logs.pdf`);
  };

  const renderTable = (list: ItemType[], label: string) => {
    const filtered = filterItems(list);
    return (
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Device ID</TableHead>
            <TableHead>Device Number</TableHead>
            <TableHead>Device Type</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Lab</TableHead>
            <TableHead>Custodian</TableHead>
            <TableHead>Activety</TableHead>
            <TableHead>Activety By</TableHead>
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
          {filtered.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.deviceNumber ? item.deviceNumber:"N/A"}</TableCell>
              <TableCell>{item.deviceType}</TableCell>
              <TableCell>{item.department.department_Name}</TableCell>
              <TableCell>
                {item.lab.labName || "N/A"} ({item.lab.labNumber ?? "N/A"})
              </TableCell>
              <TableCell>{item.lab.custodian?.name || "N/A"}</TableCell>
              <TableCell>{item.activety}</TableCell>
              <TableCell>
                {item.assignedBy?.name ? item.assignedBy.name : item.transferedBy?.name} ({item.assignedBy?.role ? item.assignedBy.role : item.transferedBy?.role})
              </TableCell>
              <TableCell>{item.assignedBy?.email ? item.assignedBy.email : item.transferedBy?.email }</TableCell>
              <TableCell>
                {clientLoaded
                  ? new Date(item.dateNow).toLocaleDateString()
                  : "Loading..."}
              </TableCell>
              <TableCell>
                {clientLoaded
                  ? item.dateTill
                    ? new Date(item.dateTill).toLocaleDateString()
                    : "N/A"
                  : "Loading..."}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="my-1 sticky top-1  h-screen shadow-md">
      
      <CardContent>
        <Tabs
          defaultValue="approved"
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as any)}
          className="w-full"
        >
          <div className="flex justify-between">
            <div className=" flex  gap-3">
             
              <h1 className="text-2xl "><b>Item Logs</b>:</h1>
            <div className="flex gap-2 items-center"> 
              <TabsList className="mb-4 ">
                <TabsTrigger className="cursor-pointer" value="approved">Approved Logs</TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="rejected">Rejected Logs</TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="pending">Pending Logs</TabsTrigger>
              </TabsList>
            </div>
            </div>
            <div className="flex gap-2 ">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={handleDownload}>Download</Button>
            </div>
          </div>

          <TabsContent value="approved">
            {renderTable(approvedItems, "Approved")}
          </TabsContent>
          <TabsContent value="rejected">
            {renderTable(rejectedItems, "Rejected")}
          </TabsContent>
          <TabsContent value="pending">
            {renderTable(pendingItems, "Pending")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Logs;
