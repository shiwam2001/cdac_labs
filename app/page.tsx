import React from 'react'
import Link from 'next/link'
import { MdLogin } from "react-icons/md";
import { FaRegIdCard } from "react-icons/fa";

const page = async () => {
  // const user = await getCurrentUser()
  // if (user) {
  //   if (user?.role === "ADMIN") {
  //     redirect("/admin")
  //   } else if (user?.role === "USER") {
  //     redirect("/user")
  //   } else{
  //     redirect("/custodian/profile")
  //   }
  // }
  // else {
  //   redirect("/login")
  // }
  return (
    <div>
      <nav className='flex justify-between items-center bg-gray-800 text-white p-4'>
        <div className='flex items-center gap-3'>
          <img src="./cdacLogo.png" width={50} alt="" />
          <h1 className='text-3xl font-medium '>CDAC Laboratory Management System</h1>
        </div>
        <div className='text-md flex gap-3 '>
          <button className='flex'>
            <Link
              className='flex px-5 py-1 rounded-2xl bg-blue-600 font-medium text-white hover:bg-blue-700 transitio items-center gap-1'
              href='/login'>
              < MdLogin />
              SignIn</Link></button>
          <button className=''>
            <Link
              className='flex items-center px-3 py-2 rounded-xl border font-medium border-blue-600 text-blue-600 hover:bg-blue-50 transition gap-1'
              href='/register'>
              <FaRegIdCard />
              SignUp</Link></button>
        </div>
      </nav>
    </div>
  )
}

export default page
