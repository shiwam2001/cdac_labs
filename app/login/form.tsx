'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { login } from '../actions/action1'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'


const page = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error,setError] = useState<string|null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isValid, setIsValid] = useState(false)

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsValid(true)

    const { email, password } = formData

    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    const user = {
      email, password
    }
    
    const result= await login(user)

    if(!result?.success){
        setError(result?.message || "Something went wrong contect your Developer.")
        setIsValid(false)
        return
    }
    
    setIsValid(false)
}


  return (
    <div className='flex gap-10  login'>

      <div className='flex register flex-col m-auto mt-[5%] justify-center gap-3  px-10 rounded-2xl  items-center '>
        <img src="/cdacLogo.png" alt="" />

        <h2 className='text-3xl mt-5 text-center font-semibold'>CDAC Laboratory Management System</h2>
        <div className='flex flex-col  w-full '>


          <form onSubmit={handleSubmit} className='flex  flex-col max g' >
              
            <label className='text-gray-600 font-medium text-lg' htmlFor="email">Email address </label>
            <Input
             type='email'
             required
              placeholder='Email'
              id='email'
              onChange={handleChange}
              className='border w-full border-gray-300 px-3 py-2  text-md rounded'
            />
            

            <div className='flex justify-between items-center'>
              <label className='text-gray-600 font-medium' htmlFor="password">Password</label>
              <p className='text-gray-500 text-smm hover:text-gray-700 cursor-pointer'>Forgot Password?</p>
            </div>

            <div className='relative flex items-center'>

              <Input
               
                type={showPassword ? "text" : "password"}
                id='password'
                placeholder='Enter password'
                onChange={handleChange}
                className='border w-full border-gray-300  px-3 py-2 text-md rounded'
              />
             
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-2 top-2 text-sm font-bold text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                {showPassword ? '🙈 Hide' : '👁️ View'}
              </button>
            </div>

           {error && <p className='text-sm text-center font-bold text-red-500'>{error}</p> }
 
            <div className='flex items-center justify-between'>
              <button type='submit' className='mt-4 bg-blue-400 text-gray-700 hover:text-gray-600 font-bold  w-full text-center hover:bg-blue-300 cursor-pointer  rounded py-2 px-4'>{isValid ? "Submitting..." : "Submit"}</button>
            </div>

          </form>


          <div className='flex text-center mt-3 text-sm m-auto sign-in  justify-center gap-1'>
            <h5 className=' text-gray-400'>New user?</h5>

            <a href="/register" className='text-blue-500  underline font-bold hover:text-blue-400 '>Sign up</a>
          </div>
        </div>
      </div>

      <div className=' flex    '>
        <img className='flex items-center imagin  rounded-l-4xl' src="/original-ba68e98ea10e1867e831884c3b153387.webp" alt="" />
      </div>
    </div>

  )
}

export default page
