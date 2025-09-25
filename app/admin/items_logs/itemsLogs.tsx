"use client"

import React, { useState, useEffect } from "react"
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
import { Department, User } from "@prisma/client"

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

    createdAt: Date
    custodian: User | null
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
  department: Department
}

type LogsProps = {
  items: ItemType[]
}

const Logs: React.FC<LogsProps> = ({ items }) => {
  const [clientLoaded, setClientLoaded] = useState(false)

  // Ensure date formatting happens only after the client is loaded
  useEffect(() => {
    setClientLoaded(true)
  }, [])

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
            <TableCell>{item.department.department_Name}</TableCell>
            <TableCell>
              {item.lab.labName || "N/A"} ({item.lab.labNumber ?? "N/A"})
            </TableCell>
            <TableCell>{item.lab.custodian?.name || "N/A"}</TableCell>
            <TableCell>
              {item.assignedBy.name} ({item.assignedBy.role})
            </TableCell>
            <TableCell>{item.assignedBy.name}</TableCell>
            <TableCell>
              {clientLoaded ? item.dateNow.toLocaleDateString() : "Loading..."}
            </TableCell>
            <TableCell>
              {clientLoaded
                ? item.dateTill
                  ? item.dateTill.toLocaleDateString()
                  : "N/A"
                : "Loading..."}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <Card className=" mt-2  h-screen  shadow-md">
      <CardContent>
        <Tabs defaultValue="approved" className="w-full">
          <div className="flex gap-2 ">
            <CardTitle className="text-xl font-bold">Item Logs:</CardTitle>
            <TabsList className="mb-4">
              <TabsTrigger value="approved">Approved Logs</TabsTrigger>
              <TabsTrigger value="rejected">Rejected Logs</TabsTrigger>
              <TabsTrigger value="pending">Pending Logs</TabsTrigger>
            </TabsList>
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
  )
}

export default Logs
