'use client'
import { deleteLab, getLabsDetail, updateCustodianName } from '@/app/actions/action1'
import React, { useState } from 'react'
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { MdAssignmentInd } from "react-icons/md";

export interface LabType {
    labId: number;
    labNumber: number;
    labName: string;
    custodianName: string;
  }

type labDetail = {
    labId: number;
    labName: string;
    labNumber: number;
    custodianName: string;

}
type props = {
    labDetail: labDetail[]
}

const details = ({ labDetail }: props) => {
    const [showModal, setShowModal] = useState(false)
    const [custodianName,setCustodianName] = useState('')
    const [selectedLab,setSelectedLab] = useState<LabType | null>(null)

    const handleDelete = async (labNumber: number) => {
        const result = confirm("Are you want to Deleted the laboratory.")

        if (result) {
            await deleteLab({ labNumber })
        }
    }

    const updateName = async () => {
        if(!selectedLab){
            alert('Here not available selected lab')
        }
        if (!selectedLab || !selectedLab.labNumber) return;

        const updateCustodian = await updateCustodianName({
            labNumber: selectedLab?.labNumber,
            custodianName: custodianName
        })

        alert("Custodian name updated successfully");
        setShowModal(false)
        setCustodianName('')

    }


    return (
        <div className='mx-3'>
            <h1 className='mt-1  text-xl font-medium  pb-2'>Created Laboratory Details:</h1>
            <div className='border-2   rounded-xl h-screen overflow-y-auto  '>
                <table className='w-full  text-lg  text-left'>
                    <thead className='sticky top-0'>
                        <tr >
                            <th className='p-2   border-b w-1/8 '>Lab id</th>
                            <th className='p-2 pl-6  border-b w-1/6'>Lab Number</th>
                            <th className='p-2 pl-6  border-b w-1/6'>Lab Name</th>
                            <th className='p-2 border-b w-1/5'>Custodian Name</th>
                            <th className='p-2 border-b w-1/8 '>Actions</th>
                        </tr>
                    </thead>
                    {labDetail.length === 0 ? (
                        <tbody>
                            <tr >
                                <td colSpan={5} className='text-center text-2xl py-4 text-gray-500'>Here no any lab created...</td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody className='text-lg font-medium'>
                            {labDetail.map((item) =>
                                <tr key={item.labId}>
                                    <td className='p-2 pl-6 border-b'>{item.labId}</td>
                                    <td className='p-2 pl-6 border-b'>{item.labNumber}</td>
                                    <td className='p-2 pl-6 border-b'>{item.labName}</td>
                                    <td className='p-2  border-b'>{item.custodianName}</td>
                                    <td className='p-2  border-b'>
                                        <div className='flex gap-5'>
                                            <div className='wrapper'>
                                                <span className='tooltip'>Update custodian name</span>
                                                <button onClick={() => { setSelectedLab(item); setShowModal(true); }} className='cursor-pointer '><FaRegEdit size={20} /></button>
                                            </div>

                                            <div className='wrapper'>
                                                <span className='tooltip'>Assign Laboratory</span>

                                                <button className='cursor-pointer'><MdAssignmentInd size={20} /></button>
                                            </div>

                                            <div className='wrapper'>
                                                <span className='tooltip bg-red-400 text-white'>Delete Laboratory</span>

                                                <button onClick={() => handleDelete(item.labNumber)} className='cursor-pointer'>< MdDeleteForever size={20} /> </button>
                                            </div>

                                        </div>
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    )}


                </table>
            </div>
            {showModal && (
                <div className='fixed inset-0  bg-opacity-10 flex items-center justify-center z-50'>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
                        <h2 className="text-xl font-semibold mb-4">Change Custodian</h2>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={custodianName}
                            onChange={(e) => setCustodianName(e.target.value)}
                            placeholder="Enter new custodian name"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded"
                             onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            onClick={updateName}
                            >
                                Save
                            </button>
                        </div>
                    </div>

                </div>

            )
            }
        </div>
    )
}
export default details
