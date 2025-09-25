import React from 'react';
import SideBar from '../components/sideBar';
import { Toaster } from '@/components/ui/sonner';
import { getCurrentUser } from './actions/action1';
import Loading from './loading';
import type { Metadata } from "next";
import "./globals.css";
import sideBar from '../components/sideBar';



export const metadata: Metadata = {
  title: "CDAC-Noida",
  description: "Made by Intern Team",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // const pathname = usePathname()
  const user = await getCurrentUser()

  // const hideSideBarRoutes = ["/login", "/register"]
  // const sideBarRoutes = hideSideBarRoutes.includes(pathname)
  
  if (!user) <div><Loading /></div>

  return (
      <html lang="en">
        <body
          className={` antialiased`}
        >
          <div className='text-gray-700  '>
            <div className='flex  w-full shadow-xl'>
              <div >
          <SideBar role={user?.role}  />
        </div>
              <div className= {` w-full bg-gray-50 min-h-screen  overflow-y-auto `}>
                {children}
              </div >
              <Toaster />
            </div>
          </div>
        </body>
      </html>
    );
  }