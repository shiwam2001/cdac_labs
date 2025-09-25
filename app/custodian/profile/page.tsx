import { getCurrentCustodian, getCurrentUser } from '@/app/actions/action1'
import React from 'react'
import ProfileMain from "./profileMain"

const page = async () => {

    const custodian = await getCurrentUser()

    const currentCustodian=await getCurrentCustodian(custodian!.email)

    console.log((currentCustodian))
    
  return (
    <div>
      <ProfileMain currentCustodian={currentCustodian}/>
    </div>
  )
}

export default page
