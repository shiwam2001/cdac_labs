import React from 'react'
import ItemsLogs from "./itemsLogs"
import { getCurrentUser } from '@/app/actions/action1'
import { getCustodianItems, getItemLogs } from '@/app/actions/itemActions'

const page = async () => {
    const itemDetails = await getItemLogs()
    return (
        <div className='bg-gray-100 h-screen  sticky top-0 z-50 '>
            
            <div className='p-2 '>
            <ItemsLogs items={itemDetails} />
            </div>
        </div>
    )
}

export default page
