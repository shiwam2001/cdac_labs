"use client";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MdDeleteForever } from "react-icons/md";
import { MinimalUser } from "./User";
import { Trash2 } from "lucide-react";

type Props = {
  user: MinimalUser;
};

const AssignedLabs = ({ user }: Props) => {
  const [userLogs, setUserLogs] = useState(user);
  const [deleteLabId, setDeleteLabId] = useState<number | null>(null);

  // const handleDelete = (id: number) => {
  //   setUserLogs((prev) => ({
  //     ...prev,
  //     assignedLabs: prev.assignedLabs.filter((lab) => lab.id !== id),
  //   }));
  //   setDeleteLabId(null);
  //   console.log("Deleted Lab with id:", id);
  //   // yaha backend API call kar sakte ho
  // };

  return (
    <div className="mt-6">
      <h1 className="text-xl mb-3 border-b pb-2 font-semibold text-gray-800">
        Assigned Laboratories
      </h1>

      <div className="rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableCaption>A list of laboratories assigned to the user.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">Sr No.</TableHead>
              <TableHead className="">Lab ID</TableHead>
              <TableHead>Lab Number</TableHead>
              <TableHead>Lab Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Custodian</TableHead>
            
            </TableRow>
          </TableHeader>

          <TableBody>
            {userLogs.assignedLabs.length > 0 ? (
              userLogs.assignedLabs.map((item,index) => (
                <TableRow key={item.id}>
                  <TableCell>{index+1}.</TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.lab.labId}</TableCell>
                  <TableCell>{item.lab.labName}</TableCell>
                  <TableCell>{item.lab.department.department_Name}</TableCell>
                  <TableCell>{item.lab.custodian?.name || "N/A"}</TableCell>
                  
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No laboratories assigned
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      {/* <Dialog open={!!deleteLabId} onOpenChange={() => setDeleteLabId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Are you sure you want to delete this laboratory?
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-500">
            This action cannot be undone. The lab will be permanently removed
            from this user.
          </p>
          <DialogFooter className="flex justify-center gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteLabId(null)}>
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => deleteLabId && handleDelete(deleteLabId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default AssignedLabs;
