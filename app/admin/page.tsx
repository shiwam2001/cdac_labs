import React from 'react'
import { getCurrentUser } from '../actions/action1'
import { redirect } from 'next/navigation'
import BasicInformation from '../user/profile/BasicInformation'
import Profile from "./profile"
import { getItemsDetails } from '../actions/itemActions'
import PieCharts from "./pieChart"
import UsersTable from './usersTable'

const page = async () => {
  const user = await getCurrentUser()
  const itemDetails = await getItemsDetails()
  if (!user || user.role != "ADMIN") {
    redirect("/login")
  }
  return (
    <div className='px-4 mb-4 '>
     
       <BasicInformation user={user} />
       <div className='flex gap-3 w-full mt-5'>
        <UsersTable/>
       <div className='w-full flex flex-col gap-3'>

       <Profile itemDetails={itemDetails}/>
       <PieCharts itemDetails={itemDetails} />
       </div>
       </div>
    </div>
  )
}

export default page
