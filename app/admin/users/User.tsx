"use client"

import React, { useState } from 'react'

import ApprovedUsers from './approvedUser';
import RejectedUsers from './rejectedUsers';
import PendingUsers from './pendingUser';
import { IoSearch } from 'react-icons/io5';
import { IoChevronForwardOutline } from "react-icons/io5";

export type Employee = {
  employeeId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  action: string;
};

export type LabDetails ={
  labId:number;
  labNumber:number;
  labName:string;
  custodianName:string;
}

type props = {
  employee: Employee[]
  labDetails:LabDetails[]
}

const User = ({ employee,labDetails }: props) => {
  const [empData, setEmpData] = useState(employee)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentTab, setCurrentTab] = useState('Pending')
  const Tables = ["Pending","Approved","Rejected"]

  return (
    <div className=' shadow-xl  p-4 bg-gray-100 '>
      <div className='flex  sticky-0 z-10 items-center gap-1 '>
        <h1 className='text-3xl font-bold'>Users</h1>
        < IoChevronForwardOutline className='text-gray-700 ' size={25} />
        <div className='flex items-center gap-20  '>

   
        <div>
          {Tables.map((tab) => (
            <button key={tab} onClick={() => setCurrentTab(tab)}
              className={`capitalize px-4 py-2 rounded-md ${currentTab === tab ? "bg-gray-200 text-gray-700" : "bg-gray-100"
                }`}
            >
              {tab} Users
            </button>
          ))}
        </div>
        </div>
      </div>

      <div>    
        {currentTab === "Pending" && <PendingUsers pendingUsers={employee} />}
        {currentTab === "Approved" && <ApprovedUsers approvedUsers={employee} labDetails={labDetails}  />}
        {currentTab === "Rejected" && <RejectedUsers rejectedUsers={employee}  />}
      </div>



    </div>
  )
}

export default User
