"use client"
import React from 'react'
import { MdDashboardCustomize } from "react-icons/md";
import { MdSpaceDashboard } from "react-icons/md";
import { IoLogOut, IoPerson } from "react-icons/io5";
import { FaBox, FaCalculator, FaUser } from "react-icons/fa6";
import { IoGitPullRequestSharp } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import Link from 'next/link';
import { FaCogs, FaTachometerAlt } from 'react-icons/fa';
import { redirect, usePathname } from 'next/navigation';
import { userLogout } from '../actions/action1';
import { FaComputer } from "react-icons/fa6";
const navigations = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: <MdSpaceDashboard size={18} />
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: <FaUser size={18} />
  },
  {
    name: "Inventory",
    href: "/admin/inventory",
    icon: <FaCalculator size={18} />
  },
  {
    name:'Laboratory',
    href:'/admin/laboratory',
    icon: <FaComputer size={18}/>
  }
]

const sideBar = () => {

  const pathName = usePathname()
  console.log(pathName)

  const handleLogout = async () => {
    const result = confirm("Are you sure to logout?")
    if (result) {
      await userLogout()
      redirect('/')
    }
  };


  return (
    <div className='bg-gray-100 w-[20%] top-0 h-screen sticky'>
      <div className=' text-gray-700 flex flex-col  rounded-l-2xl p-3 pr-6  '>
        <h1 className='text-2xl border-b-2 pb-1  font-bold'>CDAC Lab Inventory Management System</h1>
        <h2 className='ml-2 mt-3 text-center text-xl font-bold underline'>Admin Panel</h2>
        {navigations.map((nav) => [
          <div className='m-1'>

            <Link href={nav.href}>
              <div className={`flex items-center ml-2  gap-1 p-4 hover:bg-gray-400 hover:text-white rounded-lg ${nav.href == pathName ? "bg-gray-300 text-gray-700" : ""}`}>
                {nav.icon}
                <button value='dashboard' className='font-bold text-xl '>{nav.name}</button>
              </div>
            </Link>
          </div>
        ])}
        <div className='flex items-center gap-2 p-2 pl-4 fixed mb-12 bottom-0 text-gray-500 ml-3 pr-43 border-2  border-red-300 rounded-lg  hover:text-gray-700  hover:bg-red-400 cursor-pointer transition duration-300'>
          <button onClick={handleLogout} className='cursor-pointer font-bold text-xl'>Logout</button>
          <IoLogOut size={20} className='cursor-pointer ' />
        </div>
      </div>


    </div>
  )
}

export default sideBar
