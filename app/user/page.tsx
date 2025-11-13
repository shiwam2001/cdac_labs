import React from 'react'
import { getCurrentUser} from '../actions/action1'
import User from './profile/User'
import { redirect } from 'next/navigation'
import BasicInformation from './profile/BasicInformation'

const page = async () => {
  const user = await getCurrentUser()
  if (!user || user.role !== "USER") {
    redirect("/login")
  }
  return (
    <div className='p-4'>  
      <nav className='flex items-center justify-between '>
        <h2 className=' text-2xl font-bold'>User profile</h2>
        <div className='flex items-center gap-4'>
          {user && <p key={user.email} className='font-semibold'>Welcome, <u className='text-xl italic'>{user.name}</u>  </p>}
        </div>
      </nav>
      <BasicInformation user={user} />
      <User user={user} />
    </div>
  )
}

export default page
