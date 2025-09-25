import { getCurrentUser } from '@/app/actions/action1'
import { getCustodianItems } from '@/app/actions/itemActions'
import React from 'react'
import Logs from "./logs"
import { IoChevronForwardOutline } from 'react-icons/io5'

const page = async() => {
    const currentUser= await getCurrentUser()
      
      console.log(currentUser)
      const items = await getCustodianItems(currentUser!.email)
  return (
    <div className='bg-gray-100 p-2 px-3 '>
        <div className='flex items-center'>

        <h2 className='font-medium ml-2 text-2xl'> Item logs </h2>
        < IoChevronForwardOutline className='text-gray-700 ' size={25} />
        </div>
      <Logs items={items}/>
    </div>
  )
}

export default page
