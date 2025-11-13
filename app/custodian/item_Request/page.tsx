import React from 'react'
import Main from "./main"
import { getTransferRequests } from '@/app/actions/transferActions'

const page =async () => {
 
  const transferItems = await getTransferRequests()

console.log("transfer items in notification page",transferItems)
  return (
    <div className='p-4'>
     <Main transferItems={transferItems} />
    </div>
  )
}

export default page
