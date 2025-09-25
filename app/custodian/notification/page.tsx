import React from 'react'
import Main from "./main"
import { getCustodianItems, getItemsDetails } from '@/app/actions/itemActions'
import { getCurrentUser } from '@/app/actions/action1'


const page =async () => {
  const itemsDetails = await getItemsDetails()
  const currentUser= await getCurrentUser()
  // if(currentUser && typeof currentUser === "object"){
  // }
  console.log(currentUser)
  const items = await getCustodianItems(currentUser!.email)
  console.log(items)
  
  return (
    <div className='p-4'>
     
     <Main items={items} />
    </div>
  )
}

export default page
