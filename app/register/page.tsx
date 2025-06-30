"use client"
import { create } from 'domain';
import React, { useEffect, useState } from 'react'
import { createUser, deleteUser } from '../api/actions';
import { Role } from '@prisma/client';

const page = () => {

  const [formData, setFormData] = useState({
    name:"",
    employeeId:'',
    email:'',
    password:'',
    confirmPassword:""

  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e:React.ChangeEvent<HTMLFormElement>) => {
      e.preventDefault()
  
      const { name, employeeId, email, password, confirmPassword } = formData;

      if (!name || !employeeId || !email || !password || !confirmPassword) {
        alert("All fields are required");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const newuser = {
        name,
        employeeId,
        email,
        password,
        role: Role.USER
      }
      const res = await createUser(newuser);
      const deletedUser = await deleteUser(1)
      alert("user deleted successfully")
      console.log("user created :", res);
      alert("User created successfully! Please login to continue.");
  }

  return (
    <div className='flex register '>
    
    <div className='flex flex-col justify-center  m-auto gap-8  rounded-lg   px-8 p-8 mt-20'>

      <h1 className='text-4xl text-center '>Register at CDAC Labs</h1>
      <form  onSubmit={handleSubmit}>

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
        <input type="password"   id='password' name={formData.password} onChange={handleChange} className='border border-gray-300  px-3 py-2 text-md rounded' placeholder='Password' />

        <label htmlFor="confirmPassword">Confirm password</label>
        <input type="password"  id='confirmPassword' name={formData.confirmPassword} onChange={handleChange} className='border border-gray-300  px-3 py-2 text-md rounded' placeholder='Confirm Password' />

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
      <img className='flex items-center imagin  rounded-l-4xl'   src="/original-ba68e98ea10e1867e831884c3b153387.webp" alt="" />
    </div>
    </div>
  )
}

export default page
