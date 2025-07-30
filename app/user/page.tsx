import React from 'react'
import { IoLogOut } from 'react-icons/io5'
import { getCurrentUser, userLogout } from '../actions/action1'
import User from './user/page'
import { redirect } from 'next/navigation'

const page = async () => {

 const user = await getCurrentUser()
  if (!user){
    redirect("/login")
  }
  console.log(user)
  
  return (
    <div>
     <User user={user}/>
    </div>
  )
}

export default page
