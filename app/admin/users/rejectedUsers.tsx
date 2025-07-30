import React, { useState } from 'react'
import { Employee } from './User'
import { approveUser } from '@/app/actions/action1'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FaCircleDown } from 'react-icons/fa6'
import { IoSearch } from 'react-icons/io5'

type props = {
    rejectedUsers:Employee[]
}
const rejectedUsers = ({rejectedUsers}:props) => {
const [empData, setEmpData] = useState(rejectedUsers)
const [searchTerm,setSearchTerm] = useState('')

    const handleApprove = async (email: string) => {
        const user = await approveUser({ email })
        setEmpData((data) =>
          data.map((item) =>
            item.email === email ? { ...item, action: 'APPROVED' } : item)
        )
    }

    const users=empData.filter((data)=>data.action==="REJECTED")

      const handleDownload = (tableId: string) => {
        const doc = new jsPDF();
        autoTable(doc, { html: `#${tableId}` })
        doc.save(`${tableId}-table.pdf`)
    
      }
    

  return (
    <div >

    <div className='flex justify-between items-center'>
            <h3 className=' ml-2 mt-2 text-md font-semibold mb-2'>Rejected Users</h3>
             <div className='flex items-center gap-2'>
            
                      <div className='relative w-full max-w-sm'>
                        <IoSearch className='absolute left-3 top-4 transform -translate-y-1/2 text-gray-400' size={18} />
                        <input
                          type="text"
                          name='search'
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder='Search by name'
                          className='pl-10 pr-3 mb-2 py-1  border border-gray-400 rounded-xl w-full'
                        />
                      </div>
            
                      <div className='wrapper flex'>
                        <span className='tooltip'>Download table</span>
                        <button onClick={() => handleDownload('approvedUsers')} className='mr-5 cursor-pointer '>
                          <FaCircleDown size={25} />
                        </button>
                      </div>
                    </div>
          </div>
    <div className='border-2   rounded-xl h-screen overflow-y-auto '>
      <table id='rejectedUsers' className='w-full  text-lg  text-left'>

        <thead className='sticky top-0'>

          <tr className='bg-gray-100'>
            <th className='p-2 pl-6  border-b w-1/6  '>Employee Id</th>
            <th className='w-1/6 p-2 border-b '>Name</th>
            <th className='p-2 border-b w-1/5'>Email</th>
            <th className='p-2 border-b w-1/7'>Department</th>
            <th className='w-1/7 p-2 border-b '>Role</th>
            <th className='w-1/6 p-2 border-b text-center'><div className=''>Action</div></th>
          </tr>
        </thead>

        {
          users.length===0 ? (
            <tbody  className=''>
            <tr>
            <td colSpan={5} className='text-center py-4 text-2xl text-gray-500'>Not any rejected user available...</td>
          </tr>
          </tbody>
        ) : (users.map((items) => {
          return (
            <tbody>

              <tr key={items.email} className='hover:bg-gray-50 '>
                <td className=' p-2 border-b pl-6'>{items.employeeId}</td>
                <td className='p-2 border-b'>{items.name}</td>
                <td className='p-2 border-b'>{items.email}</td>
                <td className='p-2 border-b'>{items.department}</td>
                <td className='p-2 border-b '>{items.role}</td>
                <td className='p-2 border-b mb-3 text-center'>
                  <button
                    onClick={() => handleApprove(items.email)}
                    className='border-1 border-green-400 cursor-pointer font-medium  hover:bg-green-200 py-2 rounded-full w-22 text-center shadow-md transition'>Approve</button>
                </td>
              </tr>
                    </tbody>
          )
        }))
        }
      </table>
    </div>
  </div>
  )
}

export default rejectedUsers
