import React, { useState } from 'react'
import { Employee } from './User'
import { rejectUser } from '@/app/actions/action1'
import Modal from '@/components/ui/modal';
import { FaCircleDown } from "react-icons/fa6";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IoSearch } from 'react-icons/io5';
import { LabDetails } from './User';

type props = {
    approvedUsers: Employee[]
    labDetails: LabDetails[]
}
const approvedUser = ({ approvedUsers, labDetails }: props) => {
    const [empData, setEmpData] = useState(approvedUsers)
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const handleReject = async (email: string) => {
        const user = await rejectUser({ email })
        setEmpData((data) =>
            data.map((item) =>
                item.email === email ? { ...item, action: 'REJECTED' } : item
            )
        )
    }



    const handleDownload = (tableId: string) => {
        const doc = new jsPDF();
        autoTable(doc, { html: `#${tableId}` })
        doc.save(`${tableId}-table.pdf`)

    }

    const users = empData.filter((data) => data.action === 'APPROVED' && data.name.toLowerCase().includes(searchTerm.toLowerCase()))
    return (
        <div >
            <div className='flex justify-between items-center'>
                <h3 className=' ml-2 mt-2 text-md font-semibold mb-2'>Approved Users</h3>
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
            <div className='border-2   rounded-xl h-screen overflow-y-auto  '>
                <table id='approvedUsers' className='w-full  text-lg  text-left'>

                    <thead className='sticky top-0'>

                        <tr className='bg-gray-100'>
                            <th className='p-2 pl-6  border-b w-1/6 '>Employee Id</th>
                            <th className='w-1/6 p-2 border-b '>Name</th>
                            <th className='p-2 border-b w-1/5'>Email</th>
                            <th className='p-2 border-b w-1/7'>Department</th>
                            <th className='w-1/7 p-2 border-b'>Role</th>
                            <th className='w-1/6 p-2 border-b text-center'> <div className=''>Action</div> </th>
                        </tr>
                    </thead>

                    {users.length === 0 ? (
                        <tbody>

                            <tr>
                                <td colSpan={5} className='text-center text-2xl py-4 text-gray-500' >Not any approved user available... </td>
                            </tr>
                        </tbody>
                    ) : (
                        users.map((items) => {
                            return (
                                <tbody className=''>

                                    <tr key={items.email} className='hover:bg-gray-50 '>
                                        <td className=' p-2 border-b pl-6 '>{items.employeeId}</td>
                                        <td className='p-2 border-b'>{items.name}</td>
                                        <td className='p-2 border-b'>{items.email}</td>
                                        <td className='p-2 border-b'>{items.department}</td>
                                        <td className='p-2 border-b'>{items.role}</td>
                                        <td className='p-2 border-b mb-3 text-center'>
                                            <div className='flex gap-1'>

                                                <button onClick={() => handleReject(items.email)} className='border-1 border-red-400 cursor-pointer font-medium px-4 hover:bg-red-200 py-2 rounded-full w-20 shadow-md transition'>Reject</button>
                                                <div>
                                                    <button onClick={() => setIsOpen(true)} className='border-1 border-gray-600 hover:bg-gray-200 p-2 rounded-full cursor-pointer '>Assign-Lab</button>
                                                    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                                                        <h2 className="text-xl font-semibold border-b-1  mb-3 pb-2">Choose laboratory for assign to User</h2>
                                                       

                                                            <div className='font-md flex w-full  '>
                                                                <table className='w-full'>
                                                                    <thead>
                                                                        <tr >
                                                                            <th className='left-0 w-1/3'>Lab Number</th>
                                                                            <th className='w-1/2'>Lab Name</th>
                                                                            <th className=''>Select</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {labDetails.map((item) =>
                                                                        <tr className='hover:bg-gray-50 rounded'>
                                                                            <td>    {item.labNumber}         </td>
                                                                            <td>    {item.labName}         </td>
                                                                            <td><input type="checkbox" size={20} id='check-1' /></td>
                                                                        </tr>
                                                                )}
                                                                    </tbody>
                                                                </table>
                                                              
                                                                
                                                            </div>


                                                        <button className='absolute right-5 p-1 mt-2 text-center  cursor-pointer text-xl hover:text-gray-900  px-4 py-1 bg-green-300 hover:bg-green-400 text-gray-500 font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'>Confirm</button>
                                                    </Modal>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            )
                        }))}



                </table>
            </div>


        </div>
    )
}

export default approvedUser
