import React from 'react'
import { getUsers } from './api/actions'

const page = async() => {
  const data = await getUsers()
  console.log("users :",data)
  return (
    <div>
      
    </div>
  )
}

export default page
