'use client'

import React, { useState } from 'react'
import { login } from '../actions/action1'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

const Page = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isValid, setIsValid] = useState(false)

  // Regex patterns
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const pwdRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsValid(true)
    setError(null)

    const { email, password } = formData

    // Check if fields are empty
    if (!email || !password) {
      setError("All fields are required")
      setIsValid(false)
      return
    }

    // Regex validation
    // if (!emailRe.test(email)) {
    //   setError("Enter a valid email address")
    //   setIsValid(false)
    //   return
    // }

    // if (!pwdRe.test(password)) {
    //   setError("Password must be at least 8 chars, include uppercase, lowercase, number & special char")
    //   setIsValid(false)
    //   return
    // }

    // Call login API
    const result = await login({ email, password })
    if (!result?.success) {
      setError(result?.message || "Something went wrong, contact your Developer.")
      setIsValid(false)
      return
    }

    setIsValid(false)
    router.push('/') // redirect after successful login
  }

  return (
    <div className='flex gap-10 login '>
      <div className='flex register flex-col m-auto mt-[5%] justify-center gap-3 px-10 rounded-2xl items-center'>
        
        <Image src="/cdacLogo.png" width={150} height={150} alt="CDAC Logo" />

        <h2 className='text-3xl mt-5 text-center font-semibold'>
          CDAC Inventory Management System
        </h2>

        <div className='flex flex-col w-full'>
          <form onSubmit={handleSubmit} className='flex flex-col'>
            
            {/* Email */}
            <label className='text-gray-600 font-medium text-lg' htmlFor="email">Email address</label>
            <Input
              type='email'
              required
              placeholder='Email'
              id='email'
              onChange={handleChange}
              className='border w-full border-gray-300 px-3 py-2 text-md rounded'
            />

            {/* Password */}
            <div className='flex justify-between items-center mt-3'>
              <label className='text-gray-600 font-medium' htmlFor="password">Password</label>
              <p className='text-gray-500 text-sm hover:text-gray-700 cursor-pointer'>Forgot Password?</p>
            </div>

            <div className='relative flex items-center'>
              <Input
                type={showPassword ? "text" : "password"}
                id='password'
                placeholder='Enter password'
                onChange={handleChange}
                className='border w-full border-gray-300 px-3 py-2 text-md rounded'
              />

              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-2 top-2 text-sm font-bold text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                <span suppressHydrationWarning>
                  {showPassword ? '🙈 Hide' : '👁️ View'}
                </span>
              </button>
            </div>

            {/* Error */}
            {error && <p className='text-sm text-center font-bold text-red-500'>{error}</p>}

            {/* Submit */}
            <div className='flex items-center justify-between mt-3'>
              <button
                type='submit'
                className='bg-blue-400 text-gray-700 hover:text-gray-600 font-bold w-full text-center hover:bg-blue-300 cursor-pointer rounded py-2 px-4'
              >
                <span suppressHydrationWarning>
                  {isValid ? "Submitting..." : "Submit"}
                </span>
              </button>
            </div>
          </form>

          <div className='flex text-center mt-3 text-sm m-auto sign-in justify-center gap-1'>
            <h5 className='text-gray-400'>New user?</h5>
            <a href="/register" className='text-blue-500 underline font-bold hover:text-blue-400'>Sign up</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
