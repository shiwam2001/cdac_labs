import React from 'react'
import { IoLogOut } from 'react-icons/io5'
import { getCurrentUser, userLogout } from '../actions/action1'
import User from './user'
import { redirect } from 'next/navigation'

const page = async () => {

 const user = await getCurrentUser()
 console.log(user)
  if (!user){
    redirect("/login")
  }
  
  return (
    <div>
     <User user={user}/>
    </div>
  )
}

export default page
