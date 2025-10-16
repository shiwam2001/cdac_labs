"use client";
import React, { useState } from "react";
import { MinimalUser } from "./User";
import { Mail, User as UserIcon, IdCard, Building } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Action, Role } from "@prisma/client";

interface User{
   id: number; 
   employeeId: string; 
   name: string; 
   email: string; 
   departmentId: number; 
   role: Role; 
   action: Action; 
   createdAt: Date; 
   department: { departmentId: number; createdAt: Date; department_Name: string; 
}
}

type Props = {
  user: User;
};

const BasicInformation = ({ user }: Props) => {
  const [formData, setFormData] = useState({
    name: user.name,
    employeeId: user.employeeId,
    email: user.email,
    department: user.department.department_Name,
  });

  const [newName, setNewName] = useState(formData.name);

  const handleSave = () => {
    setFormData((prev) => ({ ...prev, name: newName }));
    console.log("Updated Name:", newName);
    // yaha backend API call kar sakta hai
  };

  return (
    <div className="w-full mt-5">
      <div className="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl w-full">
        {/* Header with Avatar + Edit */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
              {formData.name[0]}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {formData.name}
              </h2>
              <p className="text-gray-500">User Profile</p>
            </div>
          </div>

          {/* Edit Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Profile Information</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Name Editable */}
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter new name"
                  />
                </div>

                {/* Email Readonly */}
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input value={formData.email} disabled />
                </div>

                {/* Employee ID Readonly */}
                <div>
                  <label className="text-sm font-medium">Employee ID</label>
                  <Input value={formData.employeeId} disabled />
                </div>

                {/* Department Readonly */}
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <Input value={formData.department} disabled />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="flex items-center gap-3">
            <UserIcon className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{formData.name}</p>
            </div>
          </div>

          {/* Employee ID */}
          <div className="flex items-center gap-3">
            <IdCard className="text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="font-medium">{formData.employeeId}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{formData.email}</p>
            </div>
          </div>

          {/* Department */}
          <div className="flex items-center gap-3">
            <Building className="text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Department / Project</p>
              <p className="font-medium">{formData.department}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
