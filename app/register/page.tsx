"use client"
import React, { useEffect, useState } from 'react'

import { Role } from '@prisma/client';
import createUser, { Action } from '../actions/action1';
import { redirect } from 'next/navigation';

const page = () => {

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    password: '',
    confirmPassword: '',

  })

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { name, email, employeeId, password, confirmPassword } = formData

    if (!name || !email || !employeeId || !password || !confirmPassword) {
      alert("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      alert('Passwords should match')
      return
    }

    const newUser = {
      name,
      email,
      employeeId,
      password,
      role: 'USER' as Role,
      action: "Pending" as Action
    }

    const res = await createUser(newUser)

    if (res) {
      alert("User created successfully")
      setFormData({
        name: '',
        email: '',
        employeeId: '',
        password: '',
        confirmPassword: '',
      }
      )
    } else{
      alert("Registration failed")
    }
  }


  return (
    <div className='flex register '>

      <div className='flex flex-col justify-center  m-auto gap-8  rounded-lg   px-8 p-8 mt-20'>

        <h1 className='text-4xl text-center '>Register at CDAC Labs</h1>
        <form onSubmit={handleSubmit}>

          <div className='flex flex-col gap-4 w-full'>
            <label htmlFor="name">Employee name</label>
            <input
              type="text"
              id='name'
              name={formData.name}
              onChange={handleChange}
              className='border border-gray-300  px-3 py-2 text-md rounded'
              placeholder='Full Name'
            />

            <label htmlFor="employeeId">Employee ID</label>
            <input type="text"
              id='employeeId'
              name={formData.employeeId}
              onChange={handleChange}
              className='border border-gray-300  px-3 py-2 text-md rounded'
              placeholder='Employee Id'
            />


            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id='email'
              name={formData.email}
              onChange={handleChange}
              className='border border-gray-300  px-3 py-2 text-md rounded' placeholder='Email' />

            <label htmlFor="password">Password</label>
            <div className='relative flex items-center'>

              <input type={showPassword ? "text" : 'password'} id='password' name={formData.password} onChange={handleChange} className='relative border border-gray-300 w-full  px-3 py-2 text-md rounded' placeholder='Password' />
              <button type='button' className='absolute right-2 top-2 text-gray-500 hover:text-gray-700' onClick={() => setShowPassword((prev => !prev))}>{showPassword ? "Hide" : 'View'}</button>
            </div>

            <label htmlFor="confirmPassword">Confirm password</label>
            <div className='relative flex items-center'>
              <input type={showPassword ? "text" : 'password'} id='confirmPassword' name={formData.confirmPassword} onChange={handleChange} className='border border-gray-300 w-full px-3 py-2 text-md rounded' placeholder='Confirm Password' />
              <button type='button' className='absolute right-2 top-2 text-gray-500 hover:text-gray-700' onClick={() => setShowPassword((prev => !prev))}>{showPassword ? "Hide" : 'View'}</button>
            </div>
          </div>


          <div>
            <button type='submit' className=' bg-blue-400 mt-8 text-gray-700 hover:text-gray-600 font-bold  hover:bg-blue-300 cursor-pointer  rounded py-2 px-4'>Register</button>

          </div>
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
