"use client"
import React from 'react'
import BasicInformation from './BasicInformation'

export type User={
    name:string;
    email:string;
    employeeId:string ;
    role:string ;
    department:string;
    action:string
    id:number
    
}

type props = {
    user:User
}

function user({user}:props) {
  console.log(user.id)

  return (
    <div className=''>
       <div >
            <nav className='flex items-center justify-between '>
              <h2 className=' text-xl font-bold'>User profile</h2>
              <div className='flex items-center gap-4'>
                {user  && <p key={user.email} className='font-semibold'>Welcome, <u className='text-xl italic'>{user.name}</u>  </p> }                
              </div>
            </nav>

            <div>
              <BasicInformation user={user} />
            </div>
          </div>
    </div>
  )
}

export default user
