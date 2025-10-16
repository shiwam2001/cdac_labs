import React from 'react';
import SideBar from '../components/sideBar';
import { Toaster } from '@/components/ui/sonner';
import { getCurrentUser } from './actions/action1';
import Loading from './loading';
import type { Metadata } from "next";
import "./globals.css"

export const metadata: Metadata = {
  title: "CDAC-Noida",
  description: "Made by an Intern",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser()
  if (!user) <div><Loading /></div>
  return (
    <html lang="en">
      <body className={`antialiased`} >
          <div className='flex w-full shadow-xl text-gray-700  '>
            <div >
              {user?.role && <SideBar role={user.role} />}
            </div>
            <div className={` w-full bg-gray-50 min-h-screen  overflow-y-auto `}>
              {children}
            </div >
              
          </div>
      </body>
    </html>
  );
}