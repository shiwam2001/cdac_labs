import React from 'react'
import { IoLogOut } from 'react-icons/io5'
import { getCurrentUser, userLogout } from '../actions/action1'
import User from './profile/page'
import { redirect } from 'next/navigation'

const page = async () => {

 const user = await getCurrentUser()
  if (!user  || user.role != "USER"){
    redirect("/login")
  }
  console.log(user)
  
  return (
    <div className='p-4'>
     <User user={user}/>
    </div>
  )
}

export default page
