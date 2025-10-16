'use client'
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { DeviceType, deviceTypes } from '@/lib/DeviceTypes'
import { User } from '../profile/User'
import { Lab } from '@prisma/client'
import { addItems } from '@/app/actions/itemActions'
import { toast } from 'sonner'
import { Department } from '@/app/admin/laboratory/main'

export interface MinimalLab {
    labId: number;
    labName: string | null;
    custodian: {
        id: number;
        employeeId: string;
        name: string;
        email: string;
        role: string;
    } | null;
    department: {
        departmentId: number;
        department_Name: string;
        createdAt: Date;
    };
}
type MinimalAssignedLab = {
    lab: MinimalLab
}
type MinimalUser = Omit<User, "assignedLabs"> & {
    assignedLabs: MinimalAssignedLab[]
}
type Props = {
    user: MinimalUser | null
    labs: Lab[]
}

const Main: React.FC<Props> = ({ user }) => {
    const [date, setDate] = useState<Date>()
    const [selectedDept, setSelectedDept] = useState<number | null>(null)
    const [selectedLab, setSelectedLab] = useState<number | null>(null)
    const [selectedDevice, setSelectedDevice] = useState<string>("")
    const [customDevice, setCustomDevice] = useState<string>("")
    const [deviceNumber, setDeviceNumber] = useState("")
    const [isValid, setIsValid] = useState(false)
    const [customDeviceQuantity, setCustomDeviceQuantity] = useState<number>(0)

    // Extract departments from assignedLabs
    const departments: Department[] = Array.from(
        new Map(
            user?.assignedLabs.map(a => [
                a.lab.department.departmentId,
                {
                    departmentId: a.lab.department.departmentId,
                    department_Name: a.lab.department.department_Name
                }
            ]) ?? []
        ).values()
    )

    // Filter labs by department
    const filteredLabs =
        selectedDept && user
            ? user.assignedLabs
                .filter((a) => a.lab.department.departmentId === selectedDept)
                .map((a) => ({
                    labId: a.lab.labId,
                    labName: a.lab.labName ?? "",
                    custodian: a.lab.custodian, // ✅ pura object
                    department: a.lab.department,
                }))
            : [];

    const handleAdd = async () => {
        setIsValid(true)
        if (!selectedDept || !selectedLab || !user) {
            setIsValid(false)
            return
        }

        const payload = {
            departmentId: selectedDept,
            labId: selectedLab,
            assignedUserId: user.id,
            custodianName:
                filteredLabs.find(e => e.labId === selectedLab)?.custodian?.name || "",
            deviceNumber,
            deviceQuantity:selectedDevice === "Other" ? customDeviceQuantity : 1,
            deviceName: selectedDevice === "Other" ? customDevice : selectedDevice,
            dateTill: date,
        }

        const res = await addItems(payload)
        if (res) {
            setIsValid(false)
            setDeviceNumber("")
            setSelectedDevice("")
            setCustomDevice("")
            setCustomDeviceQuantity(0)
            setDate(undefined)
            toast("Your item has been added to the laboratory.")
        }
    }

    return (
        <div>
            <h1 className="text-xl font-medium mt-2 border-b">Add items:</h1>
            <div>
                {/* Department & Lab */}
                <div className="mt-2 grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-md font-medium">Choose Department:</label>
                        <Select
                            onValueChange={(value) => {
                                setSelectedDept(value ? Number(value) : null)
                                setSelectedLab(null)
                            }}
                            value={selectedDept ? String(selectedDept) : ""}   // ✅ safe
                        >

                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((dep) => (
                                    <SelectItem
                                        key={dep.departmentId}
                                        value={dep.departmentId.toString()}
                                    >
                                        {dep.department_Name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-md font-medium">Choose Laboratory:</label>
                        <Select
                            onValueChange={(value) => setSelectedLab(value ? Number(value) : null)}
                            value={selectedLab ? String(selectedLab) : ""}   // ✅ safe
                            disabled={!selectedDept}
                        >

                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose laboratory" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredLabs.map((lab) => (
                                    <SelectItem key={lab.labId} value={lab.labId.toString()}>
                                        {lab.labName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                {/* Device Inputs */}
                <div className="grid grid-cols-4 items-center gap-3 mt-3">
                    <div>
                        <label className="font-medium text-md">Device Number: </label>
                        <Input
                            type="text"
                            className='captalize'
                            value={deviceNumber}
                            onChange={(e) => setDeviceNumber(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="font-medium text-md">Device Type: </label>
                        <div className="flex flex-col gap-4 w-[23rem]">
                            <Select
                                value={selectedDevice}
                                onValueChange={(val) => setSelectedDevice(val)}
                            >
                                <SelectTrigger className="w-[23rem]">
                                    <SelectValue placeholder="Select Device" />
                                </SelectTrigger>
                                <SelectContent>
                                    {deviceTypes.map((device: DeviceType) => (
                                        <SelectItem key={device.name} value={device.name}>
                                            {device.name} ({device.category})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {selectedDevice === "Other" && (
                                <>
                                <Input
                                    type="text"
                                    placeholder="Enter custom device"
                                    value={customDevice}
                                    
                                    onChange={(e) => setCustomDevice(e.target.value)}
                                    />
                                <Input
                                    type="number"
                                    placeholder="Enter quantity"
                                    value={customDeviceQuantity}
                                    
                                    onChange={(e) => setCustomDeviceQuantity(Number(e.target.value))}
                                    />
                                    </>

                            )}
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="mt-6">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    data-empty={!date}
                                    className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon />
                                    {date ? format(date, "PPP") : <span>Pick a date(optional)</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate} />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Button onClick={handleAdd} className="mt-6">
                        {isValid ? "Processing..." : "Add"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Main

