import React from 'react'
import { getCurrentUser } from '../actions/action1'
import { redirect } from 'next/navigation'

const page = async () => {
  const user = await getCurrentUser()
  
  if (!user || user.role != "ADMIN") {
    redirect("/login")
  }
  
  return (
    <div>
      hey this is admin deshboard page
    </div>
  )
}

export default page
