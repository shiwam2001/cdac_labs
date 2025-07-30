'use client'

import { createLab } from '@/app/actions/action1';
import React, { useEffect, useState } from 'react'

export type Users = {
  employeeId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  action: string;
};
type props = {
  users: Users[]
}

const main = ({ users }: props) => {
  const [formData, setFormData] = useState({
    labNumber: 0,
    labName: '',
    custodianName: ''
  })


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }
  
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData)

    const { labNumber, labName, custodianName } = formData

    if (!labNumber || !labName || !custodianName) {
      alert("Here some fields are required.")
    }

    const labData = {
      labNumber, labName, custodianName
    }

    const dean = await createLab(labData)
    

    setFormData({
      labNumber: 0,
      labName: '',
      custodianName: ''
    })

  }

  return (
    <div className='p-3'>
      <h1 className='text-3xl font-medium'>Laboratory</h1>
      <h1 className='mt-3 text-xl font-medium border-b-1 pb-2'>Create Laboratory</h1>
      <div className=' mt-4 border-b-1 pb-5  ' >
        <form className='grid grid-cols-2 gap-4 font-medium' onSubmit={handleSubmit}>

          <div className='flex flex-col gap-1'>
            <label htmlFor="labNumber" className='text-lg'>Laboratory Number:</label>
            <input type="Number" required id='labNumber'  placeholder='Laboratory Number' onChange={handleChange} className='border border-gray-300  px-3 py-2 text-md rounded' />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor="labName" className='text-lg'>Laboratory Name:</label>
            <input type="text" required id='labName' name={formData.labName} placeholder='Laboratory Name' onChange={handleChange} className='border border-gray-300  px-3 py-2 text-md rounded' />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor="custodianName" className='text-lg'>Custodian Name:</label>
            <input type="text" required id='custodianName' name={formData.custodianName} placeholder='Custodian Name' onChange={handleChange} className='border border-gray-300  px-3 py-2 text-md rounded' />
          </div>

          <button type='submit' className='border bg-blue-100 border-blue-500 hover:bg-blue-300 hover:text-gray-600  mt-6  text-2xl font-medium rounded-xl'>Create</button>
        </form>
      </div>
    </div>
  )
}

export default main
