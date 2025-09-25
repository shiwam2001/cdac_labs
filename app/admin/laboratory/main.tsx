'use client'

import { createLab } from '@/app/actions/action1';
import React, { useEffect, useState } from 'react'
import { MdAddToPhotos } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createDepartment } from '@/app/actions/action2';
import { Action, AssignedLab, Lab, Role } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';


export type Users = {
  id: number;
  email: string;
  name: string;
  password: string;
  role: Role;
  employeeId: string;
  action: Action;
  createdAt: Date;
  departmentId: number;
  department?: Department | null;
  
  
};

export type Department = {
  departmentId:number;
  department_Name:string;
}



type props = {
  custodianUsers: Users[]
  departmentDetails:Department[]
}

const main = ({ custodianUsers,departmentDetails }: props) => {
  const [loader,setLoader] = useState(false)

  const [formData, setFormData] = useState({
    labNumber: 0,
    labName: '',
    departmentId:0,
    
    custodianId:''
  })
  const [showModal,setShowModal] = useState(false)
  const [department_Name,setDepartment_Name] = useState('')


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    
    e.preventDefault()
    setLoader(true)

    const { labNumber, labName,departmentId, custodianId } = formData

    if (!labName || !departmentId ||  !custodianId) {
      alert("Some feilds are required.")
    }

    const labData = {
      labNumber, labName,  departmentId,custodianId
    }

    const dean = await createLab(labData)

    if(dean){
      toast("Laboratory Created successfully.")
      setFormData({
        labNumber:0,
        departmentId:0,
        labName:'',
        custodianId:'',
        
      })
      setLoader(false)
    }
  }

  const handleDepartment = async(department_Name:string)=>{   
    if(!department_Name){
      alert("Department not comes here")
    }
    const result =await createDepartment({ department_Name: department_Name })
    if(result){
      setDepartment_Name('')
      setShowModal(false)
      
    } 
    toast("Department created successfully.")
  }


  return (
    <>
    {/* {loader && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )} */}
    
    <div className='mx-4 px-3 p-2 bg-white mt-2 rounded-lg'>
      
      <h1 className='mt-3 text-xl font-medium border-b-1 pb-2'>Create Laboratory</h1>
      <div className=' mt-4  pb-5  ' >
        <form className='grid grid-cols-2 gap-4 font-medium' onSubmit={handleSubmit}>

          <div className='flex flex-col gap-1'>
            <label htmlFor="labNumber" className='text-lg'>Laboratory Number:</label>
            <Input type="Number" id='labNumber' placeholder='Laboratory Number' onChange={handleChange} className='border border-gray-300  px-3 py-2 text-md rounded' />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor="labName" className='text-lg'>Laboratory Name:</label>
            <Input type="text" required id='labName' name={formData.labName} placeholder='Laboratory Name' onChange={handleChange} className='border border-gray-300  px-3 py-2 text-md rounded' />
          </div>
   

  
          <div className='flex flex-col gap-1'>
            <label htmlFor="custodianId" className='text-lg'>Custodian Name:</label>

            <Select 
                value={formData.custodianId}
                onValueChange={(value)=>
                  setFormData((prev)=>({
                    ...prev,custodianId:value
                  }))
                }
              >
                <SelectTrigger className="w-[730px]  text-md">
                  <SelectValue placeholder="Choose a Custodian" />
                </SelectTrigger>
                <SelectContent
                
                >
                  <SelectItem value='..' disabled className='text-lg font-medium'>--Select Custodian Name--</SelectItem>
                {custodianUsers.map((item)=>(
                  <SelectItem key={item.email} className='text-medium font-medium' value={item.email} >{item.name} -@{item.email}</SelectItem>
                ))}
                </SelectContent>
                
              </Select>

          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor="departmentId" className='text-lg'>Department:</label>
            <div className='w-full flex gap-2'>
              <Select 
                value={formData.departmentId.toString()}
                onValueChange={(value)=>
                  setFormData((prev)=>({
                    ...prev,departmentId:parseInt(value)
                  }))
                }
              >
                <SelectTrigger className="w-[590px]  text-md">
                  <SelectValue placeholder="Choose a Department" />
                </SelectTrigger>
                <SelectContent
                
                >
                  <SelectItem value='..' disabled className='text-lg font-medium'>--Select Department--</SelectItem>
                {departmentDetails.map((item)=>(
                  <SelectItem key={item.departmentId} className='text-medium font-medium' value={item.departmentId.toString()} >{item.department_Name}</SelectItem>
                ))}
                </SelectContent>
                
              </Select>
              {/* <input type="text" required id='custodianName' name={formData.custodianName} placeholder='Custodian Name' onChange={handleChange} className='border border-gray-300  px-3 py-2 text-md rounded' /> */}

              <Button 
              onClick={()=>setShowModal(true) }  
              className='cursor-pointer'> 
              <MdAddToPhotos />Create Department</Button>
            </div>
          </div>
           

          <Button type='submit' className={`cusrsor-pointer }`}>{loader? "Creating Laboratory...": "Create"}</Button>

        </form>
      </div>
      {showModal && (
                <div className='fixed inset-0  bg-opacity-10 flex items-center justify-center z-50'>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
                        <h2 className="text-xl border-b-1 font-semibold mb-4">Add an new Department</h2>
                        <Input
                            type="text"
                            disabled
                            className="w-full p-2 border  border-gray-300 rounded mb-4"
                                                       
                            placeholder="Department Id:(Not required)"
                        />
                        <Input
                            type="text"
                            required
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={department_Name}
                            onChange={(e)=>setDepartment_Name(e.target.value)}
                            
                            placeholder="Department name"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                            variant="outline"
                              className="px-4 py-2 cursor-pointer  "
                              onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                              onClick={()=>handleDepartment(department_Name)}
                              className="px-6  py-2 cursor-pointer"
                            >
                                Save
                            </Button>
                        </div>
                    </div>

                </div>

            )
            }
    </div>
    </>
  )
}

export default main
