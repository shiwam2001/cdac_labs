import React from 'react'
import Main from './main'
import { getCurrentUser, getDepartment, getLabsDetail } from '@/app/actions/action1'
import Details from './details'
import { getAddedItems } from '@/app/actions/itemActions'

const inventory = async () => {

  const user = await getCurrentUser()

  const labs = await getLabsDetail()

  if (!user) return;
  const addedItems = await getAddedItems(user.id);

  const departments = await getDepartment()
  console.log("This is the deparment details: ",departments)

  return (
    <div className='px-4 pt-1'>
      <h1 className='text-2xl font-bold'>User Inventory</h1>
      <Main user={user} labs={labs} />
      <Details addedItems={addedItems} getDepartment={departments} />
    </div>
  )
}

export default inventory
