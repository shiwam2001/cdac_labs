"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { approveTransfer, rejectTransfer } from "@/app/actions/transferActions"; // backend action
import { Action, User } from "@prisma/client";

type TransferItemType = {
  id: number;
  itemId: number;
  fromLabId: number;
  toLabId: number;
  fromDeptId: number;
  toDeptId: number;
  quantity: number;
  status: Action;
  activety: "UPDATE" | "ADDED" | "TRANSFER" | "DELETE";
  requestedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  item: {
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
    updatedAt: Date;
    assignedBy: User | null;
    status: Action
    activety: "UPDATE" | "ADDED" | "TRANSFER" | "DELETE";
  };
  fromLab: {
    labId: number;
    labNumber: number | null;
    labName: string | null;
    custodianName: string | null;
    createdAt: Date;
    custodianId: string | null;
    departmentId: number;
  };
  toLab: {
    labId: number;
    labNumber: number | null;
    labName: string | null;
    custodianName: string | null;
    createdAt: Date;
    custodianId: string | null;
    departmentId: number;
  };
  fromDepartment: {
    departmentId: number;
    department_Name: string;
    createdAt: Date;
  };
  toDepartment: {
    departmentId: number;
    department_Name: string;
    createdAt: Date;
  };
};

interface TransferTableProps {
  transferItems: TransferItemType[];
}

const TransferTable: React.FC<TransferTableProps> = ({ transferItems }) => {
  // 🧩 Changed state types from string → number
  const [openApproveId, setOpenApproveId] = useState<number | null>(null);
  const [openRejectId, setOpenRejectId] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [isSelect, setIsSelect] = useState(true);

  const pendingTransfers = transferItems.filter((t) => t.status === "PENDING");

  const handleApprove = async (id: number) => {
    const res = await approveTransfer(id);
    if (res.success) {
      toast.success(res.message);
      setOpenApproveId(null);
    } else {
      toast.error(res.message);
    }
  };

  const handleReject = async (id: number) => {
    const res = await rejectTransfer(id);
    toast.error("Transfer rejected.");
    setOpenRejectId(null);
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
     <div className="p-4 bg-white shadow rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Items Requests</h2>
    
            {/* ✅ Bulk Actions */}
           
              
             
            
               
            </div>
    <Table>
      <TableHeader>
        <TableRow className="font-medium">
          <TableCell>Date</TableCell>
          <TableCell>From Department</TableCell>
          <TableCell>To Department</TableCell>
          <TableCell>From Lab</TableCell>
          <TableCell>To Lab</TableCell>
          <TableCell>Device</TableCell>
         
          <TableCell>Transfered By</TableCell>
          <TableCell>Custodian</TableCell>
          
          <TableCell>Status</TableCell>
          <TableCell className="text-center w-[15%]">Action</TableCell>
          {/* {isSelect && (
            <TableCell>
              <Checkbox
                checked={
                    selected.length === pendingTransfers.length &&
                    pendingTransfers.length > 0
                }
                onCheckedChange={() => {
                    if (selected.length === pendingTransfers.length) setSelected([]);
                    else setSelected(pendingTransfers.map((t) => t.id));
                }}
                />
            </TableCell>
          )} */}
        </TableRow>
      </TableHeader>

      <TableBody>
        {pendingTransfers.length === 0 && (
          <TableRow>
            <TableCell colSpan={9} className="text-center text-gray-500">
              No pending transfers found
            </TableCell>
          </TableRow>
        )}

        {pendingTransfers.map((t) => (
          <TableRow key={t.id}>
            <TableCell>{format(new Date(t.createdAt), "dd-MM-yyyy")}</TableCell>
            <TableCell>{t.fromDepartment.department_Name}</TableCell>
            <TableCell>{t.toDepartment.department_Name}</TableCell>
            <TableCell>{t.fromLab.labName || "N/A"}</TableCell>
            <TableCell>{t.toLab.labName || "N/A"}</TableCell>
            <TableCell>
              {t.item.deviceType} - {t.item.deviceNumber}
            </TableCell>
            <TableCell>{t.item.assignedBy?.name || "N/A"}</TableCell>
            <TableCell>{t.item.custodianName || "N/A"}</TableCell>
            <TableCell>
              <span className="px-2 py-1 rounded-full text-white bg-yellow-500 text-sm">
                {t.status}
              </span>
            </TableCell>

            {/* Actions */}
            <TableCell className="flex gap-2">
              {/* Approve */}
              <Dialog
                open={openApproveId === t.id}
                onOpenChange={(open) => setOpenApproveId(open ? t.id : null)}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50"
                    >
                    <CheckCircle size={16} /> Approve
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Transfer?</DialogTitle>
                    <DialogDescription>
                      Confirm transfer approval for this device.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="p-3 bg-gray-50 rounded-md text-sm space-y-1">
                    <p>
                      <strong>Device:</strong> {t.item.deviceType} -{" "}
                      {t.item.deviceNumber}
                    </p>
                    <p>
                      <strong>From Department:</strong>{" "}
                      {t.fromDepartment.department_Name}
                    </p>
                    <p>
                      <strong>To Department:</strong>{" "}
                      {t.toDepartment.department_Name}
                    </p>
                    <p>
                      <strong>From Lab:</strong> {t.fromLab.labName || "N/A"}
                    </p>
                    <p>
                      <strong>To Lab:</strong> {t.toLab.labName || "N/A"}
                    </p>
                    <p>
                      <strong>Custodian:</strong>{" "}
                      {t.item.custodianName || "N/A"}
                    </p>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setOpenApproveId(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(t.id)}
                      >
                      Approve
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Reject */}
              <Dialog
                open={openRejectId === t.id}
                onOpenChange={(open) => setOpenRejectId(open ? t.id : null)}
                >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                    >
                    <XCircle size={16} /> Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Transfer?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to reject this transfer?
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setOpenRejectId(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleReject(t.id)}
                      >
                      Reject
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>

            {/* {isSelect && (
                <TableCell>
                <Checkbox
                  checked={selected.includes(t.id)}
                  onCheckedChange={() => toggleSelect(t.id)}
                  />
              </TableCell>
            )} */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
    
                  </>
  );
};

export default TransferTable;
