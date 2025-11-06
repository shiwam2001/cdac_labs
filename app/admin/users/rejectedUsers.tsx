'use client'

import React, { useState } from 'react';
import { Employee } from './User';
import { approveUser } from '@/app/actions/action1';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IoSearch } from 'react-icons/io5';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  rejectedUsers: Employee[];
};

const RejectedUsers: React.FC<Props> = ({ rejectedUsers }) => {
  const [empData, setEmpData] = useState(rejectedUsers);
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = async (email: string) => {
    if (confirm('Do you want to approve this user?')) {
      await approveUser({ email });
      setEmpData((prev) =>
        prev.map((item) => (item.email === email ? { ...item, action: 'APPROVED' } : item))
      );
      toast.success('User approved successfully!');
    }
  };

  const users = empData
    .filter(
      (u) =>
        u.action === 'REJECTED' &&
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.id - b.id); // Sort by unique ID

  return (
    <div className="p-6  bg-white rounded-lg mt-2 h-screen shadow">
      <div className='flex justify-between'>

      <h2 className="text-2xl font-semibold mb-2">Rejected Users</h2>

      {/* Search */}
      <div className="flex items-center gap-3 mb-2">
        <IoSearch className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 border rounded-lg px-3 py-1"
          />
      </div>
          </div>

      {/* Table */}
      <div className="overflow-x-auto ">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className='font-bold'>
              <TableCell>User ID</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell className='w-[10%]'>Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                 No users are currently rejected
                </TableCell>
              </TableRow>
            )}
            {users.map((user) => (
              <TableRow key={user.email} className="hover:bg-gray-50 transition">
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department.department_Name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center cursor-pointer gap-1 text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => handleApprove(user.email)}
                  >
                    <CheckCircle size={16} /> Approve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RejectedUsers;
