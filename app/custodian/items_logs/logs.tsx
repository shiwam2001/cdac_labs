"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

type ItemType = {
  id: number
  assignedUserId: number
  custodianName: string
  dateNow: Date
  dateTill: Date | null
  departmentId: number
  deviceNumber: string
  deviceType: string
  labId: number
  status: "PENDING" | "APPROVED" | "REJECTED"
  lab: {
    labId: number
    labNumber: number | null
    labName: string | null
    custodianName: string | null
    createdAt: Date
    departmentId: number
    custodianId: string | null
  }
  assignedBy: {
    id: number
    name: string
    employeeId: string
    email: string
    role: string
    createdAt: Date
  }
}

type LogsProps = {
  items: ItemType[]
}

const Logs: React.FC<LogsProps> = ({ items }) => {
  const approvedItems = items.filter((item) => item.status === "APPROVED")
  const rejectedItems = items.filter((item) => item.status === "REJECTED")
  const pendingItems = items.filter((item) => item.status === "PENDING")

  const renderTable = (list: ItemType[], label: string) => (
    <Table className="">
      <TableHeader>
        <TableRow>
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
        {list.length === 0 && (
          <TableRow>
            <TableCell colSpan={10} className="text-center text-gray-500">
              No {label.toLowerCase()} logs found
            </TableCell>
          </TableRow>
        )}
        {list.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.deviceNumber}</TableCell>
            <TableCell>{item.deviceType}</TableCell>
            <TableCell>{item.departmentId}</TableCell>
            <TableCell>
              {item.lab.labName || "N/A"} ({item.lab.labNumber ?? "N/A"})
            </TableCell>
            <TableCell>{item.lab.custodianName || "N/A"}</TableCell>
            <TableCell>
              {item.assignedBy.name} ({item.assignedBy.role})
            </TableCell>
            <TableCell>{item.assignedBy.email}</TableCell>
            <TableCell>{item.dateNow.toLocaleDateString()}</TableCell>
            <TableCell>
              {item.dateTill ? item.dateTill.toLocaleDateString() : "N/A"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <Card className=" mt-2 h-screen shadow-md">
      <CardHeader>
        {/* <CardTitle className="text-xl font-bold">Item Logs</CardTitle> */}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="approved" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="approved">Approved Logs</TabsTrigger>
            <TabsTrigger value="rejected">Rejected Logs</TabsTrigger>
            <TabsTrigger value="pending">Pending Logs</TabsTrigger>
          </TabsList>

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
  )
}

export default Logs
