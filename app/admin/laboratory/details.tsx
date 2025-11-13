'use client'
import { deleteLab, getLabsDetail, updateCustodianName } from '@/app/actions/action1'
import React, { useState } from 'react'
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { MdAssignmentInd } from "react-icons/md";
import { Department, Users } from './main';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Action, Role } from '@prisma/client';
import { assignLab } from '@/app/actions/action2';

export interface LabType {
  labId: number;
  labNumber: number;
  labName: string;
  custodianName: string;
}

export type labDetail = {
  labId: number
  labNumber: number | null
  labName: string | null
  custodian: { createdAt: Date; departmentId: number; name: string; email: string; id: number; role: Role; employeeId: string; password: string; action: Action; } | null
  createdAt: Date
  departmentId: number
  department: {
    department_Name: string
  }
  assignedLabs: {
    labId: number; email: string; id: number;
  }[]
}

type User = {
  id: number;
  name: string;
  email: string;
  employeeId: string;
  department: Department;
  departmentName: string;
  role: Role;
  action: Action;
}

type props = {
  departmentDetails: Department[]
  labDetail: labDetail[]
  users: Users[]
  custodianUsers: Users[]
}

const details = ({ users, custodianUsers, labDetail, departmentDetails }: props) => {
  const [showModal, setShowModal] = useState(false)
  const [custodianName, setCustodianName] = useState('')
  const [selectedLab, setSelectedLab] = useState<labDetail | null>(null)
  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [labId, setLabId] = useState<number>(0)
  const [assignedUser, setAssignedUser] = useState<string>('')
  const [happen, setHappen] = useState(false)

  const handleDelete = async (labId: number) => {

    await deleteLab({ labId })
    setOpenDelete(false)
    toast("Laboratory deleted successfully!")

  }

  const updateName = async () => {
    if (!selectedLab) {
      alert('Here not available selected lab')
    }
    if (!selectedLab || !selectedLab.labId) return;

    const updateCustodian = await updateCustodianName({
      labId: selectedLab?.labId,
      custodianName: custodianName
    })

    setOpen(false)
    setShowModal(false)
    setCustodianName('')
    toast("Custodian name updated successfully");

  }

  const handleAssignedUser = async () => {
    console.log("hello")
    setHappen(true)

    if (!labId || !assignedUser) {
      alert("here all feilds required!")
      return
    }

    const res = await assignLab(assignedUser, labId)
    if (res) {
      setAssignedUser('')
      setLabId(0)
      setHappen(false)
      toast("Laboratory has assigned to user successfully.")
    }
  }

  return (
    <>
      <div className='mx-4 p-2 bg-white rounded-lg  flex flex-col my-3'>
        <h1 className='text-xl font-medium  ml-1 pb-2'>Laboratory Details</h1>
        <div className='border-1 rounded-xl '>

          <Table className="text-medium">
            <TableHeader className=" bg-white">
              <TableRow >
                <TableHead className="w-[8%]">SR No.</TableHead>
                <TableHead className="w-[8%]">Lab id</TableHead>
                <TableHead className="w-[16%]">Lab Number</TableHead>
                <TableHead className="w-[16%]">Lab Name</TableHead>
                <TableHead className="w-[16%]">Department</TableHead>
                <TableHead className="w-[20%]">Custodian Name</TableHead>
                <TableHead className="w-[15%]">Assigned to</TableHead>
                <TableHead className="w-[20%] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            {labDetail.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-2xl py-4 text-gray-500">
                    No laboratories have been created yet.
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {labDetail.map((item, index) => (
                  <TableRow key={item.labId}>
                    <TableCell>{index + 1}.</TableCell>
                    <TableCell>{item.labId}</TableCell>
                    <TableCell>{item.labNumber}</TableCell>
                    <TableCell>{item.labName}</TableCell>
                    <TableCell>{item.department.department_Name}</TableCell>
                    <TableCell>{item.custodian?.name}</TableCell>

                    <TableCell>
                      {item.assignedLabs.length === 0 ? (
                        <span className="text-gray-500">null</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {item.assignedLabs.map((dats, index) => (
                            <span key={index}>{dats.email}</span>
                          ))}
                        </div>
                      )}
                    </TableCell>

                    <TableCell >
                      <div className="flex mr-4 gap-4">

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Dialog onOpenChange={setOpen} >
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DialogTrigger asChild>
                                    <Button
                                      onClick={() => {
                                        setSelectedLab(item)
                                        setOpen(true)
                                      }}
                                      className="cursor-pointer"
                                    >
                                      <FaRegEdit size={20} />
                                    </Button>
                                  </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Update custodian name</p>
                                </TooltipContent>
                              </Tooltip>

                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className='text-center'>Edit your <b><u>custodian</u></b> </DialogTitle>
                                  <DialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                  </DialogDescription>

                                  <Select
                                    value={custodianName}
                                    onValueChange={(value) => setCustodianName(value)} // 👈 update state
                                  >
                                    <SelectTrigger className="w-full p-2 border border-gray-300 rounded mb-4">
                                      <SelectValue placeholder="Edit Custodian" />
                                    </SelectTrigger>
                                    <SelectContent className='rounded-xl'>
                                      <SelectItem value=".." disabled>
                                      </SelectItem>
                                      {custodianUsers.map((custodian) => (
                                        <SelectItem key={custodian.id} value={custodian.name}>
                                          {custodian.name} -@{custodian.email}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                    <Button onClick={updateName}>Save</Button>
                                  </Select>

                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add to library</p>
                          </TooltipContent>
                        </Tooltip>


                        <TooltipProvider>
                          <Dialog>
                            <Tooltip>
                              <TooltipTrigger asChild >
                                <DialogTrigger asChild>
                                  <Button className="cursor-pointer"
                                    onClick={() => setLabId(item.labId)}
                                  >
                                    <MdAssignmentInd size={20} />
                                  </Button>
                                </DialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Assign Laboratory</p>
                              </TooltipContent>
                            </Tooltip>
                            <DialogContent>
                              <DialogTitle className='text-center'>Here you can <b>Assigned a Laboratory</b> to User.</DialogTitle>
                              <DialogDescription>
                                Assign a laboratory to a user so they can access only the labs granted by the Admin.                              </DialogDescription>
                              <Select
                                value={assignedUser}
                                onValueChange={(value) => setAssignedUser(value)}

                              >
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder="Here you can select your user" />
                                </SelectTrigger>
                                <SelectContent className='w-full'>
                                  {users.length === 0 ? (
                                    <SelectItem value=''>No users found. Please add one to get started.</SelectItem>
                                  ) : (
                                    users.map((item, index) =>
                                      <SelectItem className='w-[100%]' key={index} value={item.email} >{item.name} -@{item.email}</SelectItem>
                                    )
                                  )}
                                </SelectContent>
                                <Button className='cursor-pointer' onClick={handleAssignedUser}>{happen ? "Processing..." : "Confirm"}</Button>

                              </Select>
                            </DialogContent>
                          </Dialog>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Dialog onOpenChange={setOpenDelete}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                  <Button
                                    // onClick={() => handleDelete(item.labId)}
                                    className="cursor-pointer"
                                    onClick={() => setOpenDelete(true)}
                                  >
                                    <MdDeleteForever size={20} />
                                  </Button>
                                </DialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Lab</p>
                              </TooltipContent>
                            </Tooltip>
                            <DialogContent>
                              <DialogTitle>Are you sure to <u><b>Deleted the Laboratory</b></u>? </DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. This will permanently delete your <b>Laboratory</b>
                                and remove this data from our servers.
                              </DialogDescription>
                              <Button onClick={() => handleDelete(item.labId)}>Delete<MdDeleteForever size={20} /></Button>
                            </DialogContent>

                          </Dialog>
                        </TooltipProvider>
                       


                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>

        </div>
      </div>
    </>
  )
}
export default details
