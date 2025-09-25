"use client"
import React, { useState } from 'react'
import { MdOutlineNotificationsActive, MdSpaceDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { FaCalculator, FaComputer } from "react-icons/fa6";

import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import { userLogout } from '../app/actions/action1';
import { FaUser } from 'react-icons/fa';
import { Button } from './ui/button';
import { TbLogs } from "react-icons/tb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const navigation = {
  ADMIN: [
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
      name: 'Laboratory',
      href: '/admin/laboratory',
      icon: <FaComputer size={18} />
    },
    {
      name: "Item logs",
      href: "/admin/items_logs",
      icon: <TbLogs  size={18} />
    }
  ],
  USER: [
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
  ],
  CUSTODIAN: [
    {
      name: "Notification",
      href: "/custodian/notification",
      icon: <MdOutlineNotificationsActive size={20} />
    },
    {
      name: "Profile",
      href: "/custodian/profile",
      icon: <MdSpaceDashboard size={20} />
    },
    {
      name: "Inventory",
      href: "/custodian/inventory",
      icon: <FaCalculator size={20} />
    },
    {
      name: "Item logs",
      href: "/custodian/items_logs",
      icon: <TbLogs  size={18} />
    }

  ]
}


const sideBar = ({ role }: { role: string | undefined }) => {

  const pathname = usePathname()
  

  if (pathname === "/login" || pathname === "/register") {
    return null
  }
  let route = null
  if (role == "ADMIN") {
    route = navigation.ADMIN
  } else if (role == "USER") {
    route = navigation.USER
  } else {
    route = navigation.CUSTODIAN
  }

  const [loader, setLoader] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    // const result = confirm("Are you sure to logout?")
    if (isOpen) {
      setLoader(true)
      await userLogout()
      redirect('/');
      setLoader(false)
    }
  };


  return (

    <>

      {loader && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className='bg-gray-100 sticky top-0 h-screen border-r-2   flex flex-col justify-between'>
        <div className=' text-gray-700 flex flex-col rounded-l-2xl p-3 pr-6 '>
          <div className='flex items-center border-b-2 gap-3'>
            <img src="/cdacLogo.png" width={45} alt="" />
            <h1 className='text-xl pb-1 font-bold'>CDAC Laboratory Management System</h1>
          </div>

          <h2 className='ml-2 mt-3 text-center text-xl font-bold underline'>{role} Panel</h2>

          {route.map((nav) => (
            <div key={nav.name} className='ml-2'>
              <Link href={nav.href}>
                <div className={`flex items-center ml-2 px-2 gap-1  py-1 hover:bg-gray-200 hover:text-black rounded-lg ${nav.href == pathname ? "bg-gray-300 text-gray-700" : ""}`}>
                  {nav.icon}
                  <button  className='font-medium cursor-pointer text-lg'>{nav.name}</button>
                </div>
              </Link>
            </div>
          ))}
        </div>

        
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className='cursor-pointer py-1 mb-5 mx-4 ml-4 font-medium text-xl' >Logout<IoLogOut className='ml-[-5]' size={21} /></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure to <b>Logout</b> ?</AlertDialogTitle>
              <AlertDialogDescription>
                Logging out will end your current session. You’ll need to log in again to access your account.

              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}

export default sideBar



