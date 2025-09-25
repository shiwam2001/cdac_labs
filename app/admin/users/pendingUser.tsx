'use client'

import React, { useState } from 'react';
import { Employee } from './User';
import { approveUser, rejectUser } from '@/app/actions/action1';
import { Button } from '@/components/ui/button';
import { IoSearch } from 'react-icons/io5';
import { CheckCircle, XCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

type Props = {
  pendingUsers: Employee[];
};

const PendingUser: React.FC<Props> = ({ pendingUsers }) => {
  const [empData, setEmpData] = useState(pendingUsers);
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

  const handleReject = async (email: string) => {
    if (confirm('Do you want to reject this user?')) {
      await rejectUser({ email });
      setEmpData((prev) =>
        prev.map((item) => (item.email === email ? { ...item, action: 'REJECTED' } : item))
      );
      toast.success('User rejected successfully!');
    }
  };

  const users = empData
    .filter(
      (u) =>
        u.action === 'PENDING' &&
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.id - b.id); // Sort by unique ID

  return (
    <div className="p-6 mt-2 space-y-4 bg-white h-screen rounded-lg shadow">
      <div className='flex justify-between'>

      <h2 className="text-2xl font-semibold mb-4">Pending Users</h2>

      {/* Search */}
      <div className="flex items-center gap-3 mb-4">
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
      <div className="overflow-x-auto border rounded-lg">
        <Table className="min-w-full text-medium">
          <TableHeader>
            <TableRow className="font-bold">
              <TableCell>User ID</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell className="text-center">Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  No pending users found
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
                <TableCell className="text-center">
                  <div className="flex gap-2 justify-center flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => handleApprove(user.email)}
                    >
                      <CheckCircle size={16} /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleReject(user.email)}
                    >
                      <XCircle size={16} /> Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PendingUser;
