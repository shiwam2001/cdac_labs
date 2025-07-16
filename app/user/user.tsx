"use client"
import React from 'react'
import { IoLogOut } from 'react-icons/io5'
import { Role, userLogout } from '../actions/action1'

type User={
    name:string;
    email:string;
    employeeId:string ;
    role:string ;
    
}

type props = {
    user:User
}

function user({user}:props) {
  console.log(user)
    const handleLogout = async () => {
        const result =  confirm("Are you sure to logout")
        if(result) {
          await userLogout()
          alert("You logged out successfully")
        }
      }

  return (
    <div>
       <div>
            <nav className='flex items-center justify-between  p-4'>
              <h2 className=' text-xl font-bold'>CDAC lab Inventry Management System</h2>
              <div className='flex items-center gap-4'>
                {user  && <p key={user.email} className='font-semibold'>Welcome, {user.name} </p> }
                <div className='flex items-center gap-2  bg-red-500 p-2 rounded-lg text-white hover:text-gray-700  hover:bg-red-400 cursor-pointer transition duration-300'>
                  <button className='cursor-pointer' onClick={handleLogout}  >Logout</button>
                  <IoLogOut size={20} className='cursor-pointer ' />
                </div>
              </div>
            </nav>
          </div>
    </div>
  )
}

export default user
