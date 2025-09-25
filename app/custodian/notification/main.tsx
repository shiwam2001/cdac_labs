"use client"

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { getItemsApproved, handleItemRejection } from '@/app/actions/itemActions';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, formatDate } from 'date-fns';
import { Checkbox } from "@/components/ui/checkbox"

type ItemType = {
  id: number;
  assignedUserId: number;
  custodianName: string;
  dateNow: Date;
  dateTill: Date | null;
  departmentId: number;
  deviceNumber: string | null;
  deviceType: string;
  labId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  activety:"UPDATE" | "ADDED" | "TRANSFER" | "DELETE"
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
};

type MyComponentProps = {
  items: ItemType[];
};

const NotificationTable: React.FC<MyComponentProps> = ({ items }) => {
  const [openApproveId, setOpenApproveId] = useState<number | null>(null);
  const [openRejectId, setOpenRejectId] = useState<number | null>(null);
  const [selectedItems,setSelectedItems] = useState<number[]>([])
  const [isLoading,setIsLoading] = useState(false)
  const [isSelect, setIsSelect] = useState(true)
  
  const pendingItems = items.filter((item) => item.status === "PENDING");



  const handleApprove = async (id: number,activety:string) => {
    const result = await getItemsApproved(id,activety);
    if(result && activety==="DELETE"){
      toast.success("Item deleted from database successfully ✅");
      setOpenApproveId(null);
    }
    else  {
      toast.success("Item approved successfully ✅");
      setOpenApproveId(null);
    }
  };

  const handleReject = async (id: number) => {
    await handleItemRejection(id)
    // if(result){

    // }
    toast.error(`Item ${id} rejected ❌`);
    setOpenRejectId(null);
  };
  const selectAll = async () => {
    if(selectedItems.length === pendingItems.length){
      setSelectedItems([])
    }
    else{
      setSelectedItems(pendingItems.map((i)=>i.id))
    }
  }
  const toggleSelect = async (id:number) => {
    setSelectedItems((prev)=>
    prev.includes(id) ? prev.filter((i)=>i !== id):[...prev,id])
  }
  const bulkReject =  async () =>{

     if(selectedItems.length===0) toast.error("No items selected!")
      setIsLoading(true)
      for(const id of selectedItems){
        await handleItemRejection(id)
      }
      setSelectedItems([]);
      setIsLoading(false)
      toast.error(`${selectedItems.length} item(s) rejected ❌`);
  }
  const bulkApprove = async () =>{
    if(selectedItems.length===0) toast.error("No items selected!")
      setIsLoading(true)
      for( const id of selectedItems){
       const item = pendingItems.find((i)=>i.id==id)
       if(!item) continue
       await getItemsApproved(id,item.activety)

    }
    setSelectedItems([])
    setIsLoading(false)
    toast.success(`${selectedItems.length} items approved!`)
  }

  // ✅ Filter only pending items

  return (
    <>
    {isLoading && <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>}
    <div className="p-4 bg-white shadow rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>

        {/* ✅ Bulk Actions */}
       
          
          {isSelect && <div className="flex  gap-2">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={bulkApprove}
            >
            <CheckCircle size={16} /> Approve Selected
          </Button>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700"
            onClick={bulkReject}
            >
            <XCircle size={16} /> Reject Selected
          </Button>
        </div>}
        
           
        </div>
      <Table>
        <TableHeader>
          <TableRow className='font-medium'>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Lab Incharge</TableCell>
            <TableCell>Device</TableCell>
            <TableCell>Lab</TableCell>
            <TableCell>Item Details</TableCell>
            <TableCell>Activety</TableCell>
            <TableCell>Status</TableCell>
            <TableCell className='text-center w-[15%]'>Action</TableCell>
           {isSelect && <TableCell  className=''>
              <Checkbox
              checked={selectedItems.length===pendingItems.length && pendingItems.length > 0}
              onCheckedChange={selectAll}
              />
            </TableCell> } 

          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingItems.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500">
                No pending notifications found
              </TableCell>
            </TableRow>
          )}
          {pendingItems.map((item) => (
            <TableRow key={item.id}>
    <TableCell>{format (new Date(item.dateNow), "dd-MM-yyyy")}</TableCell>
<TableCell>{format(new Date(item.dateNow), "HH:mm:ss")}</TableCell>
              <TableCell>{item.assignedBy.name}</TableCell>
              <TableCell>
                {item.deviceType} - {item.deviceNumber}
              </TableCell>
              <TableCell>{item.lab.labName || 'N/A'}</TableCell>

              {/* Item Details column */}
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
                      <p><strong>Lab:</strong> {item.lab.labName} ({item.lab.labNumber})</p>
                      <p><strong>Custodian:</strong> {item.lab.custodianName || 'N/A'}</p>
                      <p><strong>Assigned By:</strong> {item.assignedBy.name} ({item.assignedBy.role})</p>
                      <p><strong>Email:</strong> {item.assignedBy.email}</p>
                      <p><strong>Date From:</strong> {item.dateNow.toLocaleDateString()}</p>
                      <p><strong>Date Till:</strong> {item.dateTill ? item.dateTill.toLocaleDateString() : 'N/A'}</p>
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
              <TableCell>{item.activety}</TableCell>

              <TableCell>
                <span className="px-2 py-1 rounded-full text-white text-sm bg-yellow-500">
                  {item.status}
                </span>
              </TableCell>

              <TableCell className="flex gap-2">
                {/* Approve Dialog */}
                <Dialog open={openApproveId === item.id} onOpenChange={(isOpen) => setOpenApproveId(isOpen ? item.id : null)}>
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
                      <DialogTitle>Approve Device?</DialogTitle>
                      <DialogDescription>
                        Please review the device details before approving.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="p-3 rounded-md bg-gray-50 text-sm space-y-2">
                      <p><span className="font-semibold">Device:</span> {item.deviceType} - {item.deviceNumber}</p>
                      <p><span className="font-semibold">Lab:</span> {item.lab.labName || "N/A"}</p>
                      <p><span className="font-semibold">Custodian:</span> {item.lab.custodianName || "N/A"}</p>
                      <p><span className="font-semibold">Assigned By:</span> {item.assignedBy.name} ({item.assignedBy.role})</p>
                      <p><span className="font-semibold">Email:</span> {item.assignedBy.email}</p>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenApproveId(null)}>
                        Cancel
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(item.id,item.activety)}
                        >
                        Approve
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Reject Dialog */}
                <Dialog open={openRejectId === item.id} onOpenChange={(isOpen) => setOpenRejectId(isOpen ? item.id : null)}>
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
                      <DialogTitle>Reject Device?</DialogTitle>
                      <DialogDescription>
                        Please confirm before rejecting this request.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="p-3 rounded-md bg-gray-50 text-sm space-y-2">
                      <p><span className="font-semibold">Device:</span> {item.deviceType} - {item.deviceNumber}</p>
                      <p><span className="font-semibold">Lab:</span> {item.lab.labName || "N/A"}</p>
                      <p><span className="font-semibold">Assigned By:</span> {item.assignedBy.name} ({item.assignedBy.role})</p>
                      <p><span className="font-semibold">Email:</span> {item.assignedBy.email}</p>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenRejectId(null)}>
                        Cancel
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleReject(item.id)}
                        >
                        Reject
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
              {isSelect &&  <TableCell>
                <Checkbox 
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={()=>toggleSelect(item.id)}
                  />
              </TableCell>}
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
                  </>
  );
};

export default NotificationTable;
