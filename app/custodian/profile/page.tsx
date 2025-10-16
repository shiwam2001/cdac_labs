import { getCurrentCustodian, getCurrentUser } from '@/app/actions/action1'
import React from 'react'
import ProfileMain from "./profileMain"
import BasicInformation from '@/app/user/profile/BasicInformation'
import { redirect } from 'next/navigation'


const page = async () => {

  const user = await getCurrentUser()
  if (!user || user.role !== "CUSTODIAN") {
    redirect("/login")
  }

  const currentCustodian = await getCurrentCustodian(user!.email)

  return (
    <div>
      <div className='px-4'>
        <BasicInformation user={user} />
      </div>
      <ProfileMain currentCustodian={currentCustodian} />
    </div>
  )
}

export default page
