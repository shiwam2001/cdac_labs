import React from 'react'
import InventoryReports from './inventory-reports'
import { getDepartment } from '@/app/actions/action1'
const page = async () => {
  const department = await getDepartment()
  return (
    <div>
      <InventoryReports department={department} />
    </div>
  )
}

export default page
