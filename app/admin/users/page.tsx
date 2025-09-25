import { getLabsDetail, getUsers } from '@/app/actions/action1'
import { getDepartmentDetail } from '@/app/actions/action2'
import React from 'react'
import User from './User'

const page = async() => {
   const users = await getUsers()
   console.log(users)
   const labs =   await getLabsDetail()
   const departmentDetails = await getDepartmentDetail()
  return (
    <div>
      <User employee={users} labDetails={labs} departmentDetails={departmentDetails}/>
    </div>
  )
}

export default page

