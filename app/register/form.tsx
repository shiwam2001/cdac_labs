"use client"
import React, {useState} from 'react'

import { Role } from '@prisma/client';
import createUser, { Action } from '../actions/action1';
import { Department } from '../admin/laboratory/main';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';

type props = {
    departmentDetails: Department[]
}

const page = ({ departmentDetails }: props) => {

    const [showPassword, setShowPassword] = useState(false);
    const [deptDetail, setDeptDetail] = useState(departmentDetails)
    const [isValid, setIsValid] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        employeeId: '',
        departmentId: 0,
        password: '',
        confirmPassword: '',

    })
    console.log(formData)

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))

    }

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsValid(true)

        const { name, email, employeeId, departmentId, password, confirmPassword } = formData

        if (!name || !email || !employeeId || !departmentId || !password || !confirmPassword) {
            alert("All fields are required")
            setIsValid(false)
            return
        }

        if (password !== confirmPassword) {
            alert('Passwords should match')
            setIsValid(false)
            return
        }

        const newUser = {
            name,
            email,
            employeeId,
            departmentId,
            password,
            role: 'USER' as Role,
            action: "Pending" as Action
        }

        const res = await createUser(newUser)



        if (res) {
            setTimeout(() => {
                setIsValid(false)
                setIsSubmit(true)
                toast("User registered successfully!")
            }, 750)
            return setFormData({
                name: '',
                email: '',
                employeeId: '',
                departmentId: 0,
                password: '',
                confirmPassword: '',
            }
            )
        } else if(!res) {
            setIsValid(false)
            toast.error("There are some problems try again.")
        }else{
            alert("registered unsuccessfully!")
            setIsValid(false)
        }




    }


    return (
        <div className='flex register '>

            <div className='flex flex-col justify-center  m-auto gap-8  rounded-lg   px-8 p-8 '>

                <h1 className='text-4xl text-center '>Register at CDAC LMS</h1>
                <form onSubmit={handleSubmit}>

                    <div className='flex flex-col gap-3 w-full'>
                        <div className='flex flex-col gap-1'>

                            <label htmlFor="name" className='font-medium text-lg'>Employee name</label>
                            <Input
                                type="text"
                                id='name'
                                value={formData.name}
                                onChange={handleChange}
                                className='border border-gray-300  px-3 py-2 text-md rounded'
                                placeholder='Full Name'
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-1'>

                            <label htmlFor="employeeId" className='font-medium text-lg'>Employee ID</label>
                            <Input type="text"
                                id='employeeId'
                                value={formData.employeeId}
                                onChange={handleChange}
                                className='border border-gray-300  px-3 py-2 text-md rounded'
                                placeholder='Employee Id'
                                required
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="email" className='font-medium text-lg'>Email address</label>
                            <Input
                                type="email"
                                id='email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className='border border-gray-300  px-3 py-2 text-md rounded' placeholder='Email' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="departmentId" className='font-medium text-lg'>Department</label>
                            <Select
                                value={formData.departmentId?.toString()}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        departmentId: parseInt(value),
                                    })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {deptDetail.length===0?(
                                        <SelectItem value='none' disabled className='text-center text-medium text-gray-700'>There are no any departments.</SelectItem>

                                    ):(
                                        deptDetail.map((item) => (
                                        <SelectItem key={item.departmentId} value={item.departmentId.toString()}>
                                            {item.department_Name}
                                        </SelectItem>
                                    )))}
                                    
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="password" className='font-medium text-lg'>Password</label>
                            <div className='relative flex items-center'>

                                <Input type={showPassword ? "text" : 'password'} required id='password' value={formData.password} onChange={handleChange} className='relative border border-gray-300 w-full  px-3 py-2 text-md rounded' placeholder='Password' />
                                <button type='button' className='absolute right-2 top-2 text-gray-500 hover:text-gray-700' onClick={() => setShowPassword((prev => !prev))}>{showPassword ? "Hide" : 'View'}</button>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>

                            <label htmlFor="confirmPassword" className='font-medium text-lg'>Confirm password</label>
                            <div className='relative flex items-center'>
                                <Input required type={showPassword ? "text" : 'password'} id='confirmPassword' value={formData.confirmPassword} onChange={handleChange} className='border border-gray-300 w-full px-3 py-2 text-md rounded' placeholder='Confirm Password' />
                                <button type='button' className='absolute right-2 top-2 text-gray-500 hover:text-gray-700' onClick={() => setShowPassword((prev => !prev))}>{showPassword ? "Hide" : 'View'}</button>
                            </div>
                        </div>

                    </div>


                    <div >
                        <button type='submit' className=' bg-blue-400 mt-8 text-gray-700 w-full hover:text-gray-600 font-bold  hover:bg-blue-300 cursor-pointer  rounded py-2 px-4'>{isValid ? "Submitting..." : "Register"}</button>

                    </div>
                    {isSubmit && <div className={`text-green-500 text-xl font-medium text-center `}>User registered successfully!</div>}
                </form>

                <div className='flex text-center  text-sm m-auto justify-center gap-1'>
                    <h5 className=' text-gray-400'>Already have an account?</h5>

                    <a href="/login" className='text-blue-500 font-bold underline hover:text-blue-400'>Sign in</a>

                </div>
            </div>
            <div className=' flex items-center content-center  '>
                <img className='flex items-center imagin  rounded-l-4xl' src="/original-ba68e98ea10e1867e831884c3b153387.webp" alt="" />
            </div>
        </div>
    )
}

export default page
