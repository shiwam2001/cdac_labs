import React from 'react'
import Main from './main'
import Details from './details'
import { getLabsDetail, getUsers } from '@/app/actions/action1'

const page = async () => {
  
  const users = await getUsers()

  const labDetail = await getLabsDetail()

  return (
    <div>
      <Main  users={users}/>

      <Details labDetail={labDetail} />
    </div>
  )
}

export default page
