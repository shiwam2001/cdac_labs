"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Department, Items, User } from "@prisma/client";
import React, { useState } from "react";
import { MinimalLab } from "./main";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaRegEdit } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { RiFileTransferLine } from "react-icons/ri";
import { handleItemDeletion, transferItem, updateItem } from "@/app/actions/itemActions";
import { MdDelete } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export type ItemWithRelations = Items & {
  lab: MinimalLab;
  department: Department;
  assignedBy: User;
};

type DepartmentWithLabs = {
  departmentId: number;
  department_Name: string;
  labs: {
    labId: number;
    labName: string | null;
    labNumber: number | null;
  }[];
};

type AddedItemsTableProps = {
  addedItems: ItemWithRelations[];
  getDepartment: DepartmentWithLabs[];
};

const Details = ({ addedItems, getDepartment }: AddedItemsTableProps) => {
  const [open, setOpen] = useState(false);
  const [transferQuantity, setTransferQuantity] = useState(1)
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemWithRelations | null>(null);
  const [formData, setFormData] = useState({ deviceNumber: "", deviceType: "" });
  const [selectedDept, setSelectedDept] = useState<number | null>(null);
  const [selectedLab, setSelectedLab] = useState<number | null>(null);

  const handleEditClick = (item: ItemWithRelations) => {
    setSelectedItem(item);
    setFormData({
      deviceNumber: item.deviceNumber ?? "",
      deviceType: item.deviceType ?? "",
    });
    setOpen(true);
  };

  const handleTransferClick = (item: ItemWithRelations) => {
    setSelectedItem(item);
    setSelectedDept(null);
    setSelectedLab(null);
    setTransferOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      await updateItem(selectedItem.id, formData);
      toast.success("Item updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update item");
    }
  };

  const handleTransferSubmit = async () => {
    if (!selectedItem || !selectedDept || !selectedLab) {
      toast.error("Please select department and lab");
      return;
    }

    if (transferQuantity <=0 || transferQuantity > (selectedItem.quantity??0)){
      toast.error("Invalid transfer quantity")
      return
    }

    try {
      await transferItem(selectedItem.id, selectedDept, selectedLab,transferQuantity)

      toast.success("Item transferred successfully!");
      setTransferOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to transfer item");
    }
  };

  const handleDeleteItem = async (id: number) => {
    const result = confirm("Are you sure to deleted the perticuler item.")
    if (result) {
      await handleItemDeletion(id)
      toast.error("Item Deleted Request has gone at custodian panel.")
    }

  }
  return (
    <div>
      <h1 className="mt-4 text-xl font-semibold border-b mb-3 pb-2">
        Added Items Details
      </h1>

      <div className="border rounded-2xl shadow-sm overflow-y-auto">
        <Table className="text-base px-2">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Device Number</TableHead>
              <TableHead>Device Type</TableHead>
              <TableHead>Lab</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Custodian Name</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Valid Till</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead className="">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {addedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No items have been added yet.
                </TableCell>
              </TableRow>
            ) : (
              addedItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.deviceNumber ? item.deviceNumber : "N/A"}</TableCell>
                  <TableCell>{item.deviceType}</TableCell>
                  <TableCell>{item.lab.labName ?? "N/A"}</TableCell>
                  <TableCell>{item.department.department_Name}</TableCell>
                  <TableCell>{item.lab.custodian?.name ?? "Not Assigned"}</TableCell>
                  <TableCell>
                    {item.dateNow ? format(new Date(item.dateNow), "yyyy-MM-dd") : "N/A"}
                  </TableCell>
                  <TableCell>
                    {item.dateTill ? format(new Date(item.dateTill), "yyyy-MM-dd") : "N/A"}
                  </TableCell>
                  {/* Actions */}
                  <TableCell>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={() => handleEditClick(item)}>
                            <FaRegEdit size={20} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Update Item</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={() => handleTransferClick(item)}>
                            <RiFileTransferLine size={20} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Transfer Item</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={() => handleDeleteItem(item.id)}>
                            <MdDelete size={18} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Item</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-white font-medium text-sm ${item.status === "PENDING"
                        ? "bg-yellow-500"
                        : item.status === "APPROVED"
                          ? "bg-green-500"
                          : "bg-red-500"
                        }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Update Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Update Item</DialogTitle>
            <DialogDescription>
              Update device details here. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 font-medium">
            <div>
              <label>Device Number:</label>
              <Input
                name="deviceNumber"
                value={formData.deviceNumber}
                onChange={handleChange}
                className="uppercase"
                required
              />
            </div>

            <div>
              <label>Device Type:</label>
              <Input
                name="deviceType"
                value={formData.deviceType}
                onChange={handleChange}
                className="uppercase"
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full">
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Transfer Item</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Select new Department and Lab to transfer this item.
          </DialogDescription>

          <div className="space-y-4">
            {/* Department Select */}
            <div className="font-medium">
              <label className="block mb-1">Select Department</label>
              <Select onValueChange={(val) => setSelectedDept(Number(val))}>
                <SelectTrigger className="w-full ">
                  <SelectValue placeholder="Choose department" />
                </SelectTrigger>
                <SelectContent>
                  {getDepartment.map((dept) => (
                    <SelectItem key={dept.departmentId} value={dept.departmentId.toString()}>
                      {dept.department_Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lab Select (depends on Department) */}
            <div className="font-medium">
              <label className="block mb-1">Select Lab</label>
              <Select
                disabled={!selectedDept}
                onValueChange={(val) => setSelectedLab(Number(val))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose lab" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {getDepartment
                    .find((d) => d.departmentId === selectedDept)
                    ?.labs.map((lab) => (
                      <SelectItem key={lab.labId} className="w-full" value={lab.labId.toString()}>
                        {lab.labName ?? `Lab - ${lab.labName}`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedItem && (selectedItem.quantity ?? 0) > 1 ? (
              <div className="font-medium text-medium">

                <label htmlFor="" className=" block mb-1">
                  Enter Quantity to transfer (Available: {selectedItem.quantity})
                </label>
                <Input
                  type="number"
                  min={1}
                  max={selectedItem.quantity ?? 0}
                  value={transferQuantity}
                  onChange={(e) => setTransferQuantity(Number(e.target.value))}
                />

              </div>
            ) : (
              <p className="text-sm text-gray-600 ml-1 font-medium">Quantity is 1 (Default transfer)</p>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleTransferSubmit} className="w-full">
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Details;
