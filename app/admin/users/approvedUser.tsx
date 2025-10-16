'use client'

import React, { useEffect, useState } from 'react';
import { Employee } from './User';
import { rejectUser, updateUserRole } from '@/app/actions/action1';
import { assignLab, getLabsOfDepartment } from '@/app/actions/action2';
import { toast } from 'sonner';
import { Department } from '../laboratory/main';
import { Lab } from '@prisma/client';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { XCircle } from 'lucide-react';
import { FaRegEdit } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';

type Props = {
  approvedUsers: Employee[];
  departmentDetails: Department[];
};

const ApprovedUser: React.FC<Props> = ({ approvedUsers, departmentDetails }) => {
  const [empData, setEmpData] = useState(approvedUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [openRolePopup, setOpenRolePopup] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedUserLab, setSelectedUserLab] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(''); 

  const handleReject = async (email: string) => {
    if (confirm('Do you want to reject this user?')) {
      await rejectUser({ email });
      setEmpData((prev) =>
        prev.map((item) =>
          item.email === email ? { ...item, action: 'REJECTED' } : item
        )
      );
      toast.success('User rejected successfully');
    }
  };

  const handleRoleChange = async (email: string, role: string) => {
    const result = await updateUserRole(email, role);
    if (result) {
      setEmpData((prev) =>
        prev.map((item) => (item.email === email ? { ...item, role } : item))
      );
      toast.success('Role updated successfully!');
    } else {
      toast.error('Failed to update role');
    }
    setOpenRolePopup(null);
  };

  useEffect(() => {
    if (!selectedDepartment) return;
    const fetchLabs = async () => {
      const res = await getLabsOfDepartment(selectedDepartment);
      setLabs(res);
    };
    fetchLabs();
  }, [selectedDepartment]);

  const handleAssignLab = async () => {
    if (selectedUserLab !== null) {
      await assignLab(currentUserEmail, selectedUserLab);
      setDialogOpen(false);
      setSelectedDepartment(null);
      setSelectedUserLab(null);
      toast.success('Laboratory assigned successfully!');
    }
  };

//   const users = empData.filter(
//     (u) => u.action === 'APPROVED' && u.name.toLowerCase().includes(searchTerm.toLowerCase())
//   ).sort((a, b) => a.id - b.id);

  const users = empData
  .filter(
    (u) =>
      u.action === 'APPROVED' &&
      u.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => a.id- b.id);

  return (
   
  <div className="p-6  bg-white mt-2 rounded-lg h-screen flex flex-col">
    {/* Sticky Nav */}
    <nav className="flex justify-between  bg-white pb-2">
      <h2 className="text-2xl font-semibold">Approved Users</h2>

      {/* Search */}
      <div className="flex items-center gap-3">
        <IoSearch className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 border hover:bg-gray-200 rounded-lg px-3 py-1"
        />
      </div>
    </nav>

    {/* Scrollable Table Area */}
    <div className="flex-1 overflow-y-auto">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          {/* Sticky Table Header */}
          <TableHeader className="sticky top-0 z-40 ">
            <TableRow className="font-bold">
              <TableCell>User Id</TableCell>
              <TableCell>Employee Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell className="w-[15%]">Role</TableCell>
              <TableCell className="text-center">Action</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  No approved users found
                </TableCell>
              </TableRow>
            )}

            {users.map((user) => (
              <TableRow key={user.email} className="hover:bg-gray-50">
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department.department_Name}</TableCell>

                <TableCell className="relative">
                  <div className="flex items-center justify-between pr-8">
                    {user.role}
                    {/* Role Edit Button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className='cursor-pointer'
                      onClick={() => {
                        setOpenRolePopup(
                          openRolePopup === user.email ? null : user.email
                        );
                        setSelectedRole(user.role);
                      }}
                    >
                      <FaRegEdit className="text-gray-600 hover:text-blue-600" />
                    </Button>
                  </div>

                  {/* Role Popup */}
                  {openRolePopup === user.email && (
                    <div className="absolute z-50 bg-white border rounded-lg shadow-md p-3 top-8 left-0 w-40">
                      <Select
                        onValueChange={(val) => setSelectedRole(val)}
                        defaultValue={selectedRole}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="CUSTODIAN">Custodian</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setOpenRolePopup(null)}
                          className='cursor-pointer'
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleRoleChange(user.email, selectedRole)
                          }
                          className='cursor-pointer'
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex justify-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center cursor-pointer gap-1 text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleReject(user.email)}
                    >
                      <XCircle size={16} /> Reject
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setCurrentUserEmail(user.email);
                        setDialogOpen(true);
                      }}
                      className='cursor-pointer'
                    >
                      Assign Lab
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

    {/* Assign Lab Dialog */}
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Laboratory</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {/* Department Dropdown */}
          <div>
            <label>Department</label>
            <Select
              onValueChange={(val) => setSelectedDepartment(Number(val))}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Choose Department" />
              </SelectTrigger>
              <SelectContent>
                {departmentDetails.map((dept) => (
                  <SelectItem
                    key={dept.departmentId}
                    value={dept.departmentId.toString()}
                  >
                    {dept.department_Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lab Dropdown */}
          <div>
            <label>Laboratory</label>
            <Select
              onValueChange={(val) => setSelectedUserLab(Number(val))}
              disabled={!selectedDepartment}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Choose Laboratory" />
              </SelectTrigger>
              <SelectContent>
                {labs.map((lab) => (
                  <SelectItem key={lab.labId} value={lab.labId.toString()}>
                    {lab.labName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssignLab}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
);

  
};

export default ApprovedUser;
