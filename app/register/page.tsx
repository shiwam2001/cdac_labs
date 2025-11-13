import React from 'react'
import Form from './form'
import { getDepartmentDetail } from '../actions/action2'

const page = async() => {

  const departmentDetails =await getDepartmentDetail()

  return (
    <div className=''>
      <Form departmentDetails={departmentDetails}/>
    </div>
  )
}

export default page
