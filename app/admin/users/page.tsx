import React   from 'react'
import {  getLabsDetail, getUsers } from '../../actions/action1'
import User from './User'

const userModule = async () => {
  
  const employee = await getUsers()
  const labDetails = await getLabsDetail()

  return (
    <User  employee={employee} labDetails = {labDetails} />
  )
}

export default userModule
