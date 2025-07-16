import React   from 'react'
import {  getUsers } from '../../actions/action1'
import User from './User'


const userModule = async () => {
  
    const employee = await getUsers()

  return (
    <User  employee={employee} />
  )
}

export default userModule
