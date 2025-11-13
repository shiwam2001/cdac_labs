"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { dataDetails } from "@/app/actions/itemActions";
import { Action, Activety, User } from "@prisma/client";
import { toast } from "sonner";

interface Custodian {
  id: number;
  name: string;
  email: string;
}

interface Lab {
  labId: number;
  labName: string | null;
  labNumber: number | null;
  custodian: Custodian | null;
}

interface Department {
  departmentId: number;
  department_Name: string;
  labs: Lab[];
}

interface Data {
  id: number;
  departmentId: number;
  labId: number;
  assignedUserId: number|null;
  custodianName: string;
  quantity: number | null;
  deviceNumber: string | null;
  deviceType: string;
  dateNow: Date;
  dateTill: Date | null;
  status: Action;
  activety: Activety;
  updatedAt: Date;
  assignedBy: User | null;
  transferedBy: User | null;
}

interface Props {
  department: Department[];
}


export default function InventoryReport({ department }: Props) {
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null)
  const [selectedLab, setSelectedLab] = useState<number | null>(null)
  const [data, setData] = useState<Data[] | null>(null)
  const [isValid, setIsValid] = useState(false)

  const selectedDepartments = department.find((dep) => dep.departmentId === selectedDepartment)
  const selectedLabs = selectedDepartments?.labs.find((lab) => lab.labId === selectedLab)


  async function fetchLabDetails(selectedLab: number) {
    try {
      setIsValid(true);
      const data = await dataDetails(selectedLab);
      setData(data);

      console.log(data.map((item)=>item.updatedAt))
      toast.success("Items details successfully fetched!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch item details!");
    } finally {
      setIsValid(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 text-gray-800">
      <h1 className="text-3xl font-semibold mb-4  ">
        Inventory Reports
      </h1>

      <div className="flex gap-4 border-b-1  pb-2 mb-2  ">
        <div className="w-full space-y-1">
          <Label>Select Department:</Label>
          <Select
            value={selectedDepartment ? String(selectedDepartment) : ""}
            onValueChange={(e) => {
              setSelectedDepartment(Number(e));
              setSelectedLab(null)
            }
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose Department" />
            </SelectTrigger>
            <SelectContent>
              {department.map((item, index) =>
                <SelectItem key={index} value={item.departmentId.toString()}>{index + 1}.  {item.department_Name} </SelectItem>
              )}

            </SelectContent>
          </Select>
        </div>

        <div className="w-full space-y-1">
          <Label>Select laboratory:</Label>
          <Select
            value={selectedLab ? selectedLab.toString() : ""}
            onValueChange={(val) => setSelectedLab(Number(val))}
            disabled={!selectedDepartment}
          >

            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose Department" />
            </SelectTrigger>
            <SelectContent>
              {selectedDepartments?.labs.map((item, index) =>
                <SelectItem key={index} value={item.labId.toString()}>{index + 1}. {item.labName} @{item.custodian?.name}</SelectItem>
              )}

            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => {
            if (selectedLab) fetchLabDetails(selectedLab);
            else toast.error("Please select a lab first!");
          }}
          disabled={!selectedLab || isValid}
          className="flex mt-4 cursor-pointer"
        >
          {isValid ? "Loading..." : "Continue"}
        </Button>
      </div>

      <Card className="border border-gray-200 py-3 ">

        <CardContent className=" ">

          <div className="border border-gray-200  rounded-lg">
            <div className="flex bg-gray-50 border-b  grid-cols-2">

              <div className="p-4 bg-gray-50 w-full  border-gray-200">
                <p className="font-medium">Lab Name: {selectedLabs?.labName}</p>

                <p className="text-sm text-gray-600">LabId: {selectedLabs?.labId}
                </p>
                <p className="text-sm text-gray-600">Lab Number: {selectedLabs?.labNumber}</p>
                <p className="text-sm text-gray-600">
                  Custodian: {selectedLabs?.custodian?.name} ({selectedLabs?.custodian?.email})
                </p>

              </div>
              <div className='p-4 bg-gray-50 w-full border-gray-200'>
                <p className="font-medium">Department Name:{selectedDepartments?.department_Name} </p>
                <p className="text-sm text-gray-600">DepartmentId: {selectedDepartments?.departmentId}</p>
                <p className="text-sm text-gray-600">created at: </p>

              </div>

            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>Sr No.</TableHead>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Device Number</TableHead>
                  <TableHead>Device Type</TableHead>
                  <TableHead>Lab Incharge</TableHead>
                  <TableHead>Assigning Date</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!data || data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No items available</TableCell>
                  </TableRow>
                ) : (
                  data?.map((item, index) =>
                    <TableRow key={index}>
                      <TableCell>{index + 1}.</TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.deviceNumber ? item.deviceNumber : "N/A"}</TableCell>
                      <TableCell>{item.deviceType}</TableCell>
                      <TableCell>{item.assignedBy?.name ? item.assignedBy.name : item.transferedBy?.name}</TableCell>
                      <TableCell>{new Date(item.dateNow).toLocaleDateString()}</TableCell>

                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4">
                            <h3 className="text-lg font-semibold mb-2">Item Details:</h3>
                            <div className="space-y-1 text-sm">
                              <p><strong>Device number:</strong> {item.deviceNumber}</p>
                              <p><strong>Device:</strong> {item.deviceType} - {item.deviceNumber}</p>
                              
                              <p><strong>Quantity:</strong> {item.quantity ? item.quantity : 1}</p>
                              <p><strong>{item.assignedBy ? "Assigned By:" : "Transferred By:"}</strong> {item.assignedBy?.name ? item.assignedBy.name : item.transferedBy?.name} ({item.assignedBy?.role ? item.assignedBy.role : item.transferedBy?.role})</p>
                              <p><strong>Email:</strong> {item.assignedBy?.email ? item.assignedBy.email : item.transferedBy?.email}</p>
                              <p><strong>Activity:</strong> {item.activety}</p>
                              <p>
                                <strong>Update At:</strong>{" "}
                                {item.updatedAt ? (item.updatedAt).toLocaleDateString() : "N/A"} (
                                {item.updatedAt ? (item.updatedAt).toLocaleTimeString() : ""}
                                )
                              </p>

                              <p>
                                <strong>Date From:</strong> {item.dateNow ? (item.dateNow).toLocaleDateString() : "N/A"}
                              </p>

                              <p>
                                <strong>Date Till:</strong> {item.dateTill ? (item.dateTill).toLocaleDateString() : "N/A"}
                              </p>

                              <p>
                                <strong>Status:</strong>{' '}
                                <span className="px-2 py-1 rounded-full text-white bg-yellow-500">
                                  {item.status}
                                </span>
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
