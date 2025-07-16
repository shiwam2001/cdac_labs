"use client"

import React, { useState } from 'react'
import { Action, approveUser, rejectUser } from '@/app/actions/action1';
import { IoIosArrowDropupCircle } from "react-icons/io";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdApproval } from "react-icons/md";
import { TbPlayerEject } from "react-icons/tb";
import jsPDF from 'jspdf'
import {autoTable} from "jspdf-autotable"

type Employee = {
  employeeId: string;
  name: string;
  email: string;
  role: string;
  action: string;
};

type props = {
  employee: Employee[]
}

const User = ({ employee }: props) => {
  const [empData, setEmpData] = useState(employee)
  const [searchTerm, setSearchTerm] = useState('')
  const [dropDown, setDropDown] = useState(false)

  const handleApprove = async (email: string) => {
    const user = await approveUser({ email })
    setEmpData((data) =>
      data.map((item) =>
        item.email === email ? { ...item, action: 'APPROVED' } : item)
    )
  }

  const handleReject = async (email: string) => {
    const user = await rejectUser({ email })
      setEmpData((data) =>
      data.map((item) =>
        item.email === email ? { ...item, action: 'REJECTED' } : item
      )
    )
  }

  const pendingUsers = empData.filter((data) =>
    data.action === 'PENDING' &&
    data.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const rejectedUsers = empData.filter((data) => data.action === "REJECTED" && data.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const approvedUsers = empData.filter((data) => data.action === "APPROVED" && data.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDownlord = (tableId:string) => {
    const doc = new jsPDF();
    autoTable(doc, { html: `#${tableId}` })
    doc.save(`${tableId}-table.pdf`)
    setDropDown(false)
  }


  return (
    <div className=' shadow-xl  p-4 bg-gray-100 '>
      <div className='flex  sticky-0 z-10  justify-between '>
        <h1 className='text-3xl font-bold'>Users</h1>
        <div className='flex items-center gap-20 mr-4 '>
          <div className='flex justify-center text-center' >
            <label htmlFor="search" className='text-lg text-shadow-accent  '>Search user: </label>
            <input
              type="text"
              id='search'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search by name'
              className='border-1 p-1 pl-2 border-blue-400 rounded-xl'
            />
          </div>

          <div className='flex mr-4  flex-col px-3'>
            <button onClick={() => setDropDown(!dropDown)} className={dropDown ? 'shadow-sm border-1  rounded py-1' : ' border-blue-400'} > {dropDown ? "Download Table 🔼" : 'Download Table 🔽'}</button>
            {dropDown && <div className='flex flex-col mt-8 text-left  border rounded shadow w-40 bg-white absolute z-10  '>
              <div className='flex gap-2 pl-2 shadow py-2 text-md hover:bg-gray-200 items-center'>
              <MdApproval size={18}/>
              <button onClick={()=>handleDownlord('approvedUsers')} className='  '>Approved Users</button>
              </div>
              <div className='flex gap-2 pl-2 shadow py-2 text-md hover:bg-gray-200 items-center'>
              < TbPlayerEject size={18} />
              <button onClick={()=>handleDownlord('rejectedUsers')} className=' '>Rejected Users</button>
              </div>
              <div className='flex gap-2 pl-2 shadow py-2 text-md hover:bg-gray-200 items-center'>
              <MdOutlinePendingActions size={18} />
              <button onClick={()=>handleDownlord('pendingUsers')} className=' '>Pending Users</button>
              </div>
            </div>
            }
          </div>

        </div>
      </div>

      < div >

        <h3 className=' ml-2 mt-2 text-md font-semibold mb-2 '>Pending Users</h3>
        <div className='border-2   rounded-xl max-h-[40vh] overflow-y-auto  '>

          <table id='pendingUsers' className="w-full text-left text-lg border-collapse">
            <thead className='sticky top-0'>
              <tr className="bg-gray-100">
                <th className="p-2 pl-6 border-b w-1/6 sticky ">Employee Id</th>
                <th className="p-2 border-b w-1/5">Name</th>
                <th className="p-2 border-b">Email</th>
                <th className="p-2 border-b w-1/7">Role</th>
                <th className="p-2 border-b w-1/6 text-center"> <div className=''>Action</div> </th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((items) => (
                <tr key={items.email} className="hover:bg-gray-50 transition">
                  <td className="p-2 pl-6 border-b">{items.employeeId}</td>
                  <td className="p-2 border-b">{items.name}</td>
                  <td className="p-2 border-b">{items.email}</td>
                  <td className="p-2 border-b">{items.role}</td>
                  <td className="p-2  border-b">
                    <div className='flex gap-2 ml-2'>
                      <button
                        className=' border-1 border-green-400 cursor-pointer font-medium  hover:bg-green-200 py-2 rounded-full w-22 text-center shadow-md transition '
                        onClick={() => handleApprove(items.email)}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(items.email)}
                        className=' border-1 border-red-400 cursor-pointer font-medium px-4 hover:bg-red-200 py-2 rounded-full w-20 shadow-md transition'
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div >

        <h3 className=' ml-2 mt-2 text-md font-semibold mb-2'>Approved Users</h3>
        <div className='border-2   rounded-xl max-h-[40vh] overflow-y-auto  '>
          <table id='approvedUsers' className='w-full  text-lg  text-left'>

            <thead className='sticky top-0'>

              <tr className='bg-gray-100'>
                <th className='p-2 pl-6  border-b w-1/6 '>Employee Id</th>
                <th className='w-1/5 p-2 border-b '>Name</th>
                <th className='p-2 border-b'>Email</th>
                <th className='w-1/7 p-2 border-b'>Role</th>
                <th className='w-1/6 p-2 border-b text-center'> <div className=''>Action</div> </th>
              </tr>
            </thead>
            {approvedUsers ? <>

              {approvedUsers.map((items) => {
                return (
                  <tbody key={items.email} className=''>
                    <tr className='hover:bg-gray-50 '>
                      <td className=' p-2 border-b pl-6 '>{items.employeeId}</td>
                      <td className='p-2 border-b'>{items.name}</td>
                      <td className='p-2 border-b'>{items.email}</td>
                      <td className='p-2 border-b'>{items.role}</td>
                      <td className='p-2 border-b mb-3 text-center'>
                        <button onClick={() => handleReject(items.email)} className='border-1 border-red-400 cursor-pointer font-medium px-4 hover:bg-red-200 py-2 rounded-full w-20 shadow-md transition'>Reject</button>
                      </td>
                    </tr>
                  </tbody>
                )
              })}
            </>
              :
              <tbody>

                <h3>No Any Approved or new user login here</h3>
              </tbody>
            }
          </table>
        </div>

        <div >

          <h3 className=' ml-2 mt-2 text-md font-semibold mb-2'>Rejected Users</h3>
          <div className='border-2   rounded-xl max-h-[40vh] overflow-y-auto '>
            <table id='rejectedUsers' className='w-full  text-lg  text-left'>

              <thead className='sticky top-0'>

                <tr className='bg-gray-100'>
                  <th className='p-2 pl-6  border-b w-1/6  '>Employee Id</th>
                  <th className='w-1/5 p-2 border-b '>Name</th>
                  <th className='p-2 border-b'>Email</th>
                  <th className='w-1/7 p-2 border-b '>Role</th>
                  <th className='w-1/6 p-2 border-b text-center'><div className=''>Action</div></th>
                </tr>
              </thead>

              {rejectedUsers.map((items) => {
                return (
                  <tbody key={items.email} className=''>
                    <tr className='hover:bg-gray-50 '>
                      <td className=' p-2 border-b pl-6'>{items.employeeId}</td>
                      <td className='p-2 border-b'>{items.name}</td>
                      <td className='p-2 border-b'>{items.email}</td>
                      <td className='p-2 border-b '>{items.role}</td>
                      <td className='p-2 border-b mb-3 text-center'>
                        <button
                          onClick={() => handleApprove(items.email)}
                          className='border-1 border-green-400 cursor-pointer font-medium  hover:bg-green-200 py-2 rounded-full w-22 text-center shadow-md transition'>Approve</button>
                      </td>
                    </tr>
                  </tbody>
                )
              })}
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default User
