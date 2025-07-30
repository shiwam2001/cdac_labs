
import React from 'react'
import { getCurrentUser, userLogout } from './actions/action1'
import Link from 'next/link'

const page = async() => {

const user =  await getCurrentUser()

console.log("user: ", user)
 
  return (
    <div>
      <nav className='flex justify-between items-center bg-gray-800 text-white p-4'>
        <h1>lab inventory Management</h1>
        {user ? <div>
          <span className='mr-4'>Welcome, {user.name}</span>
          <button  className='bg-red-500 px-4 py-2 rounded'>Logout</button>
        </div>:<div><Link href="/login">Login</Link> <Link href={"/register"}>Register</Link></div>}
      </nav>
    </div>
  )
}

export default page
