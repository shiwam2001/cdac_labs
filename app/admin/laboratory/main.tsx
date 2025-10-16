"use client";

import { createLab } from "@/app/actions/action1";
import React, { useState } from "react";
import { MdAddToPhotos } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDepartment } from "@/app/actions/action2";
import { Action, Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export type Users = {
  id: number;
  email: string;
  name: string;
  password: string;
  role: Role;
  employeeId: string;
  action: Action;
  createdAt: Date;
  departmentId: number;
  department?: Department | null;
};

export type Department = {
  departmentId: number;
  department_Name: string;
};

type props = {
  custodianUsers: Users[];
  departmentDetails: Department[];
};

const main = ({ custodianUsers, departmentDetails }: props) => {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    labNumber: 0,
    labName: "",
    departmentId: 0,
    custodianId: "",
  });
  const [department_Name, setDepartment_Name] = useState("");
  const [open, setOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);
    const { labNumber, labName, departmentId, custodianId } = formData;

    if (!labName || !departmentId || !custodianId) {
      alert("Some fields are required.");
      setLoader(false);
      return;
    }

    const labData = { labNumber, labName, departmentId, custodianId };
    const dean = await createLab(labData);

    if (dean) {
      toast("Laboratory Created successfully.");
      setFormData({
        labNumber: 0,
        departmentId: 0,
        labName: "",
        custodianId: "",
      });
    }
    setLoader(false);
  };

  const handleDepartment = async (department_Name: string) => {
    if (!department_Name) {
      alert("Please enter a department name");
      return;
    }
    const result = await createDepartment({ department_Name });
    if (result) {
      toast("Department created successfully.");
      setDepartment_Name("");
      setOpen(false);
    }
  };

  return (
    <div className="mx-4 px-3 py-3 bg-white mt-2 rounded-lg">
      <h1 className="mt-1 text-xl font-semibold border-b pb-2">
        Create Laboratory
      </h1>

      <div className="mt-3 pb-5">
        <form
          className="grid grid-cols-2 gap-x-6 gap-y-3 font-medium"
          onSubmit={handleSubmit}
        >
          {/* Lab Number */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="labNumber" className="text-[15px] font-medium">
              Laboratory Number
            </label>
            <Input
              type="number"
              id="labNumber"
              placeholder="Enter Lab Number"
              className="h-9 text-[15px]"
              onChange={handleChange}
            />
          </div>

          {/* Lab Name */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="labName" className="text-[15px] font-medium">
              Laboratory Name
            </label>
            <Input
              type="text"
              required
              id="labName"
              placeholder="Enter Lab Name"
              className="h-9 text-[15px]"
              onChange={handleChange}
            />
          </div>

          {/* Custodian Name */}
          
          <div className="flex flex-col w-full space-y-1 ">
            <label htmlFor="custodianId" className="text-[15px] font-medium">
              Custodian Name
            </label>
            <Select
              value={formData.custodianId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, custodianId: value }))
              }
            >
              <SelectTrigger className="w-full h-9 text-[15px]">
                <SelectValue placeholder="Choose a Custodian" />
              </SelectTrigger>
              <SelectContent>
                {custodianUsers.map((item, index) => (
                  <SelectItem
                    key={item.email}
                    className="text-[15px] font-medium"
                    value={item.email}
                  >
                    {index + 1}. {item.name} - @{item.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department */}
          <div className="flex flex-col w-full space-y-1 ">
            <label htmlFor="departmentId" className="text-[15px] font-medium">
              Department
            </label>
            <div className="flex items-center gap-2">
              <Select
                value={formData.departmentId.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    departmentId: parseInt(value),
                  }))
                }
              >
                <SelectTrigger className="w-full h-9 text-[15px]">
                  <SelectValue placeholder="Choose a Department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentDetails.map((item) => (
                    <SelectItem
                      key={item.departmentId}
                      value={item.departmentId.toString()}
                    >
                      {item.department_Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Dialog for New Department */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer flex items-center gap-1 px-3 h-9"
                  >
                    <MdAddToPhotos className="text-lg" />
                    Add
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Add a New Department</DialogTitle>
                  </DialogHeader>

                  <Input
                    type="text"
                    required
                    className="w-full h-9 text-[15px] mb-4"
                    value={department_Name}
                    onChange={(e) => setDepartment_Name(e.target.value)}
                    placeholder="Department name"
                  />

                  <DialogFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setOpen(false)}
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleDepartment(department_Name)}
                      size="sm"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
                  
          <div className="col-span-2 flex justify-end mt-3">
            <Button type="submit" className="px-6 w-full h-9">
              {loader ? "Creating Laboratory..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default main;
