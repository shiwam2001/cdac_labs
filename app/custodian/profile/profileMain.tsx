"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import BasicInformation from "@/app/user/profile/BasicInformation";


type AssignedLabUser = {
  id: number;
  email: string;
  labId: number;
};

type Lab = {
  labId: number;
  labName: string | null;
  department: {
    departmentId: number;
    department_Name: string;
    createdAt: Date;
  };
  assignedLabs: AssignedLabUser[];
};

type Custodian = {
  id: number;
  name: string;
  email: string;
  employeeId: string;
  password: string;
  role: "CUSTODIAN" | "USER" | "ADMIN";
  action: "APPROVED" | "PENDING" | "REJECTED";
  createdAt: Date;
  departmentId: number;
  department: {
    departmentId: number;
    department_Name: string;
    createdAt: Date;
  };
  labs: Lab[];
};

// Props
type Props = {
  currentCustodian: Custodian | null;
};

// Basic Info Component
// const BasicInfo = ({ custodian }: { custodian: Custodian }) => {
//   const [name, setName] = useState(custodian.name);

//   const handleSave = () => {
//     // API call to save name
//     console.log("Saved Name:", name);
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-md p-6">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h2 className="text-2xl font-semibold">Basic Details</h2>
//         </div>
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button>Edit Name</Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle>Edit Custodian Name</DialogTitle>
//             </DialogHeader>
//             <div className="py-2">
//               <Input value={name} onChange={(e) => setName(e.target.value)} />
//             </div>
//             <DialogFooter>
//               <Button onClick={handleSave}>Save</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <p className="text-sm text-gray-500">Full Name</p>
//           <p className="font-medium">{name}</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Email</p>
//           <p className="font-medium">{custodian.email}</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Employee ID</p>
//           <p className="font-medium">{custodian.employeeId}</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Department</p>
//           <p className="font-medium">{custodian.department.department_Name}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// Lab Details Component
const LabDetails = ({ labs }: { labs: Lab[] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
      <h3 className="text-2xl font-semibold mb-4">Assigned Labs</h3>
      <Table className="min-w-full">
        <TableHeader className="bg-gray-50 sticky top-0 z-50">
          <TableRow>
            <TableCell>SR No.</TableCell>
            <TableCell>Lab ID</TableCell>
            <TableCell>Lab Name</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Assigned Users</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labs.map((lab,index) => (
            <TableRow key={lab.labId} className="hover:bg-gray-50">
              <TableCell>{index+1}.</TableCell>
              <TableCell>{lab.labId}</TableCell>
              <TableCell>{lab.labName || "N/A"}</TableCell>
              <TableCell>{lab.department.department_Name}</TableCell>
              <TableCell>
                {lab.assignedLabs.length === 0
                  ? "No Users Assigned"
                  : lab.assignedLabs.map((u) => (
                      <p key={u.id}>{u.email}</p>
                    ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Main Custodian Profile Component
const CustodianProfile = ({ currentCustodian }: Props) => {
  if (!currentCustodian)
    return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6 space-y-6 max-w-fulll mx-auto">
      
      <LabDetails labs={currentCustodian.labs} />
    </div>
  );
};

export default CustodianProfile;
