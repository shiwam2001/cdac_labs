import React from 'react'
import ItemsLogs from "./itemsLogs"
import { getCurrentUser } from '@/app/actions/action1'
import { getCustodianItems, getItemLogs } from '@/app/actions/itemActions'

const page = async () => {
    const itemDetails = await getItemLogs()
    return (
        <div className='bg-gray-100  px-2 z-50 '>
            
            
            <ItemsLogs items={itemDetails} />
            
        </div>
    )
}

export default page
