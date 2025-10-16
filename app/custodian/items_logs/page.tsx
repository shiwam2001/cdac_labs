import { getCurrentUser } from '@/app/actions/action1'
import { getCustodianItems } from '@/app/actions/itemActions'
import React from 'react'
import Logs from "./logs"
import { IoChevronForwardOutline } from 'react-icons/io5'

const page = async() => {
    const currentUser= await getCurrentUser()
    const items = await getCustodianItems(currentUser!.email)
  return (
    <div className='bg-gray-100 p-2 px-3 '> 
      <Logs items={items}/>
    </div>
  )
}

export default page
