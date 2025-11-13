import { getCurrentUser } from '@/app/actions/action1'
import { getMyTransferRequests} from '@/app/actions/transferActions'
import React from 'react'

const page =async () => {
    const user = await getCurrentUser();
    if(!user) return console.error("No user logged in");
    const transferItems = await getMyTransferRequests(user?.id);
  return (
    <div> 
    </div>
  )
}

export default page
