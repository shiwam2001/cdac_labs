"use client"
import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MdSpaceDashboard, MdOutlineNotificationsActive } from "react-icons/md"
import { FaCalculator, FaComputer, FaUser } from "react-icons/fa6"
import { TbLogs } from "react-icons/tb"
import { IoLogOut } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { userLogout } from "../app/actions/action1"

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

interface SidebarProps {
  role: string
}

const navigation: Record<string, NavItem[]> = {
  ADMIN: [
    { name: "Dashboard", href: "/admin", icon: <MdSpaceDashboard size={18} /> },
    { name: "Users", href: "/admin/users", icon: <FaUser size={18} /> },
    { name: "Inventory", href: "/admin/inventory", icon: <FaCalculator size={18} /> },
    { name: "Laboratory", href: "/admin/laboratory", icon: <FaComputer size={18} /> },
    { name: "Item logs", href: "/admin/items_logs", icon: <TbLogs size={18} /> },
  ],
  USER: [
    { name: "Profile", href: "/user", icon: <MdSpaceDashboard size={20} /> },
    { name: "Inventory", href: "/user/inventory", icon: <FaCalculator size={20} /> },
  ],
  CUSTODIAN: [
    { name: "Notification", href: "/custodian/notification", icon: <MdOutlineNotificationsActive size={20} /> },
    { name: "Profile", href: "/custodian/profile", icon: <MdSpaceDashboard size={20} /> },
    { name: "Inventory", href: "/custodian/inventory", icon: <FaCalculator size={20} /> },
    { name: "Item logs", href: "/custodian/items_logs", icon: <TbLogs size={18} /> },
  ],
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [loader, setLoader] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const routes = useMemo(() => {
    return navigation[role] || []
  }, [role])

  
  const handleLogout = async () => {
    setLoader(true)
    try {
      await userLogout()
      router.push("/login")
    } catch (err) {
      console.error(err)
    } finally {
      setLoader(false)
      setIsOpen(false)
    }
  }

  if (!role || !navigation[role]) return null

  if (pathname === "/login" || pathname === "/register") return null

  return (
    <>
      {loader && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="bg-gray-100 sticky top-0 h-screen border-r-2 flex flex-col justify-between">
        
        <div className="p-3 flex flex-col gap-3">
          <div className="flex items-center gap-3 border-b-2 pb-2">
            <img src="/cdacLogo.png" width={45} alt="Logo" />
            <h1 className="text-xl font-bold">CDAC Inventory Management</h1>
          </div>
          <h2 className="text-center text-xl font-bold underline">{role} Panel</h2>

          {routes.map((nav) => (
            <Link key={nav.name} href={nav.href}>
              <div
                className={`flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-200 hover:text-black ${
                  nav.href === pathname ? "bg-gray-300 text-gray-700" : ""
                }`}
              >
                {nav.icon}
                <span className="font-medium text-lg">{nav.name}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="p-4">
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                Logout <IoLogOut size={20} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  Logging out will end your session. You’ll need to login again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  )
}

export default React.memo(Sidebar)
