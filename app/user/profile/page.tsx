"use client"
import React from 'react'
import BasicInformation from './BasicInformation'
import AssignedLabs from './assignedLabs'
import { labDetail } from '@/app/admin/laboratory/details';

export type Department = {
  departmentId: number;
  department_Name: string;
  createdAt: Date; 
};

export type Lab = {
  labId: number | null;
  labName: string | null;
  department: Department; 
};

export type AssignedLab = {
  id: number;
  email: string;
  labId: number;
  lab: labDetail;
};

export type User = {
  id: number;
  employeeId: string;
  name: string;
  email: string;

  departmentId: number;
  role: string;
  action: string;
  createdAt: Date;

  department: Department;
  assignedLabs: AssignedLab[];
};

export interface MinimalLab {
  labId: number;
  labName: string | null;
  custodian: {
    id: number;
    employeeId: string;
    name: string;
    email: string;
    role: string;
    // aur jo bhi fields User me hain
  } | null;
  department: {
    departmentId: number;
    department_Name: string;
    createdAt: Date;
  };
}


type MinimalAssignedLab = {
  lab: MinimalLab
  id: number
  email: string
  labId: number
}

export type MinimalUser = Omit<User, "assignedLabs"> & {
  assignedLabs: MinimalAssignedLab[]
}



type props = {
    user:MinimalUser
}

 function user({user}:props) {
  
  
  return (
    <div className=''>
       <div >
            <nav className='flex items-center justify-between '>
              <h2 className=' text-2xl font-bold'>User profile</h2>
              <div className='flex items-center gap-4'>
                {user  && <p key={user.email} className='font-semibold'>Welcome, <u className='text-xl italic'>{user.name}</u>  </p> }                
              </div>
            </nav>

            <div>
              <BasicInformation user={user} />

            </div>

            <div>
              <AssignedLabs user={user}/>
            </div>
          </div>
    </div>
  )
}

export default user
