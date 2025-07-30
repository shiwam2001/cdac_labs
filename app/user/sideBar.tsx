"use client"
import React from 'react'
import { MdSpaceDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import {  FaCalculator } from "react-icons/fa6";

import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import { userLogout } from '../actions/action1';

const navigations = [
  {
    name: "Profile",
    href: "/user",
    icon: <MdSpaceDashboard size={20} />
  },
  {
    name: "Inventory",
    href: "/user/inventory",
    icon: <FaCalculator size={20} />
  },
]

const sideBar = () => {

  const pathName = usePathname()
  console.log(pathName)

  const handleLogout = async () =>{
    const result = confirm("Are you sure to logout?")
    if (result){
     await userLogout()
     redirect('/')
    }
   };
  

  return (
    <div className='bg-gray-100 w-[20%]'>
      <div className=' text-gray-700 flex flex-col  rounded-l-2xl p-3 pr-6  '>
        <h1 className='text-2xl border-b-2 pb-1  font-bold'>CDAC Lab Inventory Management System</h1>
        <h2 className='ml-2 mt-3 text-center text-xl font-bold underline'>User Panel</h2>
        {navigations.map((nav) => [
          <div className='m-1'>

            <Link href={nav.href}>
              <div className={`flex items-center ml-2  gap-1 p-4 hover:bg-gray-400 hover:text-white rounded-lg ${nav.href == pathName ? "bg-gray-300 text-gray-700" : ""}`}>
                {nav.icon}
                <button value='profile' className='font-bold text-xl '> <u>{nav.name}</u> </button>
              </div>
            </Link>
          </div>
        ])}
        <div className='flex items-center gap-2 p-2 pl-4 absolute mb-12 bottom-0 text-gray-500 ml-3 pr-43 border-2  border-red-300 rounded-lg  hover:text-gray-700  hover:bg-red-400 cursor-pointer transition duration-300'>
          <button onClick={handleLogout} className='cursor-pointer font-bold text-xl'>Logout</button>
          <IoLogOut size={20} className='cursor-pointer ' />
        </div>
      </div>


    </div>
  )
}

export default sideBar
