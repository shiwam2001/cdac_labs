import React from 'react'
import Main from './main'
import Details from './details'
import { getLabsDetail, getUsers } from '@/app/actions/action1'
import {  getApproveUsers, getCustodianUsers, getDepartmentDetail } from '@/app/actions/action2'

const page = async () => {
  const Users = await getApproveUsers()
  const custodianUsers = await getCustodianUsers()
  const labDetail = await getLabsDetail()
  const departmentDetails = await getDepartmentDetail()
  return (
    <div className='bg-gray-100 bg-fixed h-screen sticky top-0 '>
      
      <div className=' flex  flex-col overflow-y-auto'>

      <Main  custodianUsers={custodianUsers} departmentDetails={departmentDetails}/>
      <Details users={Users} labDetail={labDetail} custodianUsers={custodianUsers} departmentDetails={departmentDetails} />
      </div>
    </div>
  )
}

export default page
