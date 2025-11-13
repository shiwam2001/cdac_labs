import { getCurrentUser } from '@/app/actions/action1'
import { getCustodianItems } from '@/app/actions/itemActions'
import React from 'react'
import Logs from "./logs"

const page = async() => {
    const currentUser= await getCurrentUser()
    
    if(!currentUser) return
    const items = await getCustodianItems(currentUser.email)
  return (
    <div className='bg-gray-100 p-2 px-3 '> 
      <Logs items={items}/>
    </div>
  )
}

export default page
