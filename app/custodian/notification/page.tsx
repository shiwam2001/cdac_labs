import React from 'react'
import Main from "./main"
import { getCustodianItems } from '@/app/actions/itemActions'
import { getCurrentUser } from '@/app/actions/action1'

const page =async () => {
  const currentUser= await getCurrentUser()
  if(!currentUser) return console.error("there is no any current user to fetch")
  const items = await getCustodianItems(currentUser.email)  
  return (
    <div className='p-4'>
     <Main items={items}   />
    </div>
  )
}

export default page
