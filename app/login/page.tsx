'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { login } from '../api/action1'
import { useRouter } from 'next/navigation'

const page =  () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email:"",
    password:""
  })

  const {
    register,
    formState: { errors },
  } = useForm()

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setFormData(prev=>({...prev,[e.target.id]:e.target.value}))
  }

  const handleSubmit =async (e:React.ChangeEvent<HTMLFormElement>)=>{
    e.preventDefault()

    const {email,password} = formData

    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    const user = {
      email,password
    }

    const res = await login(user)
    console.log(res)
  
  }


  return (
    <div className='flex register'>

      <div className='flex flex-col m-auto justify-center gap-8  px-10 rounded-2xl  items-center '>

        <h2 className='text-3xl mt-5 text-center font-semibold'>CDAC Lab Inventry Management System</h2>
        <div className='flex flex-col  w-full '>


          <form onSubmit={handleSubmit} className='flex max-w-[40vw]  flex-col max gap-2' >

            <label className='text-gray-600' htmlFor="email">Email address </label>
            <input
              {...register("email")}
              placeholder='Email'
              id='email'
              onChange={handleChange}
              className='border w-full border-gray-300 px-3 py-2   text-md rounded'
            />
            {errors.email && <p className='text-red-500 text-sm'>Email is required</p>}

            <div className='flex justify-between items-center'>
            <label className='text-gray-600' htmlFor="password">Password</label>
            <p className='text-gray-500 text-smm hover:text-gray-700 cursor-pointer'>Forgot Password?</p>
            </div>

            <input
              {...register("password", { required: true, minLength: 6 })}
              type="password"
              id='password'
              placeholder='Password'
              onChange={handleChange}
              className='border w-full border-gray-300  px-3 py-2 text-md rounded'
            />
            {errors.password && (<p>Password must be at least 6 characters</p>)}

            <div className='flex items-center justify-between'>
              <button type='submit' className=' bg-blue-400 text-gray-700 hover:text-gray-600 font-bold  hover:bg-blue-300 cursor-pointer  rounded py-2 px-4'>Submit</button>
            </div>

          </form>
              

          <div className='flex text-center mt-3 text-sm m-auto justify-center gap-1'>
            <h5 className=' text-gray-400'>New user?</h5>

            <a href="/register" className='text-blue-500 underline font-bold hover:text-blue-400 '>Sign up</a>
          </div>
        </div>
      </div>

      <div className=' flex items-center content-center   '>
        <img className='flex items-center imagin  rounded-l-4xl' src="/original-ba68e98ea10e1867e831884c3b153387.webp" alt="" />
      </div>
    </div>

  )
}

export default page
