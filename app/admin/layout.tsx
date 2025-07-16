import React from 'react';
import Navbar from './navbar';
import SideBar from './sideBar';


export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <div className='text-gray-700  '>
        
        <div className='flex  rounded-2xl shadow-xl'>
          <SideBar />
        <div className='w-5/6  bg-gray-50 rounded-r-2xl  min-h-screen '>
            {children}
        </div >
        </div>
      </div>
    );
}