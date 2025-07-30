import React, { useState } from 'react'
import { User } from './page'

type props = {
    user: User
}

const BasicInformation = ({ user }: props) => {
    const [text, setText] = useState<User>(user)


    return (
        <div className='mt-5'>
            <h1 className='text-2xl  border-b-1 font-medium'>Basic information </h1>

            <div className='grid grid-cols-2 m-auto w-full p-3 '>

                <div className='text-xl items-center gap-2'>
                    <label className=' font-medium' htmlFor="">UserId </label>
                    <div
                        contentEditable={false}
                        style={{ border: "1px solid gray" }}
                        className='rounded w-100 px-2'
                    >
                        {text.id}
                    </div>

                </div>

                <div className=' text-xl   items-center gap-2'>
                    <label className=' font-medium' htmlFor="">Full name: </label>
                    <div
                        contentEditable={false}
                        style={{ border: "1px solid gray" }}
                        className='rounded w-100 px-2 '
                    >
                        {text.name}
                    </div>

                </div>

                <div className='right mt-2  text-xl  items-center gap-2'>
                    <label className=' font-medium' htmlFor="">EmployeeId: </label>
                    <div
                        contentEditable={false}
                        style={{ border: "1px solid gray" }}
                        className='rounded w-100 px-2'
                    >
                        {text.employeeId}
                    </div>

                </div>



                <div className='mt-2 text-xl items-center gap-2'>
                    <label className=' font-medium' htmlFor="">Email address: </label>
                    <div
                        contentEditable={false}
                        style={{ border: "1px solid gray" }}
                        className='rounded w-100 px-2'
                    >
                        {text.email}
                    </div>

                </div>

                <div className='mt-2 text-xl  items-center gap-2'>
                    <label className=' font-medium' htmlFor="">Status: </label>
                    <div
                        contentEditable={false}
                        style={{ border: "1px solid gray" }}
                        className='rounded w-100 px-2'
                    >
                        {text.action}
                    </div>

                </div>

                <div className='mt-2 text-xl  items-center gap-2'>
                    <label className=' font-medium' htmlFor="">Gender: </label>
                    <div className=' w-100 border-1 border-gray-500  rounded'>
                        <select className='rounded w-[100%] px-2' name="" id="">
                            <option value="">Male</option>
                            <option value="">Female</option>
                            <option value="">other</option>
                        </select>
                    </div>



                </div>

                <div className='mt-2 text-xl items-center gap-2'>
                    <label className=' font-medium' htmlFor="">Department/Project: </label>
                    <div
                        contentEditable={false}
                        style={{ border: "1px solid gray" }}
                        className='rounded w-100 px-2'
                    >
                        {text.department}
                    </div>

                </div>


            </div>

        </div>
    )
}

export default BasicInformation
