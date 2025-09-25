"use client"

import React, { useState } from 'react'
import ApprovedUsers from './approvedUser';
import RejectedUsers from './rejectedUsers';
import PendingUsers from './pendingUser';
import { IoChevronForwardOutline } from "react-icons/io5";


export type Department = {
  createdAt: Date;
  departmentId: number;
  department_Name: string;
};

export type Employee = {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  department: Department;  // 👈 ab object
  action:string
};


export type LabDetails ={
  labId:number;
  labNumber:number | null;
  labName:string | null;
  departmentId:number;
  custodianName:string | null;
  custodianId:string | null
}

type props = {
  employee: Employee[]
  labDetails:LabDetails[]
  departmentDetails:Department[]
}

const User = ({ employee,labDetails,departmentDetails }: props) => {

  const [currentTab, setCurrentTab] = useState('Pending')
  const Tables = ["Pending","Approved","Rejected"]

  return (
  <div className="shadow-xl p-4 bg-gray-100 h-screen flex flex-col">
  {/* Sticky Navbar */}
  <nav className="flex items-center gap-1 sticky top-0 z-50 bg-gray-100 pb-2">
    <h1 className="text-3xl font-bold">Users</h1>
    <IoChevronForwardOutline className="text-gray-700 " size={25} />

    <div className="flex items-center gap-20">
      <div>
        {Tables.map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={`capitalize px-4 py-2 rounded-md ${
              currentTab === tab
                ? "bg-gray-200 text-gray-700"
                : "bg-gray-100"
            }`}
          >
            {tab} Users
          </button>
        ))}
      </div>
    </div>
  </nav>

  {/* Scrollable Content */}
  <div className="flex-1 overflow-y-hidden">
    {currentTab === "Pending" && <PendingUsers pendingUsers={employee} />}
    {currentTab === "Approved" && (
      <ApprovedUsers
        approvedUsers={employee}
        departmentDetails={departmentDetails}
      />
    )}
    {currentTab === "Rejected" && <RejectedUsers rejectedUsers={employee} />}
  </div>
</div>

  )
}

export default User
