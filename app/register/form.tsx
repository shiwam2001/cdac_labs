"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Role } from "@prisma/client";
import createUser, { Action } from "../actions/action1";
import { Department } from "../admin/laboratory/main";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Props = {
  departmentDetails: Department[];
};

const page = ({ departmentDetails }: Props) => {
  // ✅ Define Zod schema
  // ✅ Define Zod schema with regex
  const registerSchema = z
    .object({
      name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"), // regex for letters + space
      email: z
        .string()
        .email("Invalid email address")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email"), // redundant but explicit
      employeeId: z
        .string()
        .min(1, "Employee ID is required")
        .regex(/^[A-Za-z0-9]+$/, "Employee ID must be alphanumeric"), // alphanumeric
      departmentId: z.number().min(1, "Department is required"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
          "Password must include uppercase, lowercase, number & special character"
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });


  const [showPassword, setShowPassword] = useState(false);
  const [deptDetail] = useState(departmentDetails);
  const [isValid, setIsValid] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    departmentId: 0,
    password: "",
    confirmPassword: "",
  });

  // ✅ Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsValid(true);
    setErrors({});

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      setIsValid(false);
      return;
    }

    const { name, email, employeeId, departmentId, password } = result.data;

    const newUser = {
      name,
      email,
      employeeId,
      departmentId,
      password,
      role: "USER" as Role,
      action: "Pending" as Action,
    };

    const res = await createUser(newUser);

    if (res) {
      setTimeout(() => {
        setIsValid(false);
        setIsSubmit(true);
        toast("User registered successfully!");
      }, 750);

      setFormData({
        name: "",
        email: "",
        employeeId: "",
        departmentId: 0,
        password: "",
        confirmPassword: "",
      });
    } else {
      setIsValid(false);
      toast.error("There are some problems, try again.");
    }
  };

  return (
    <div className="flex register">
      <div className="flex flex-col justify-center m-auto gap-8 rounded-lg px-8 p-8">
        <h1 className="text-4xl text-center">Register at CDAC IMS</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 w-full">
            {/* Name */}
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="font-medium text-lg">
                Employee name: <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
              {errors.name && (
                <p className="text-red-500 font-medium text-sm">{errors.name}</p>
              )}
            </div>

            {/* Employee ID */}
            <div className="flex flex-col gap-1">
              <label htmlFor="employeeId" className="font-medium text-lg">
                Employee ID: <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="Employee Id"
                required
              />
              {errors.employeeId && (
                <p className="text-red-500 font-medium text-sm">{errors.employeeId}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-medium text-lg">
                Email address: <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              {errors.email && (
                <p className="text-red-500 font-medium text-sm">{errors.email}</p>
              )}
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1">
              <label htmlFor="departmentId" className="font-medium text-lg">
                Department: <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.departmentId?.toString()}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    departmentId: parseInt(value),
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {deptDetail.length === 0 ? (
                    <SelectItem
                      value="none"
                      disabled
                      className="text-center text-medium text-gray-700"
                    >
                      There are no departments.
                    </SelectItem>
                  ) : (
                    deptDetail.map((item) => (
                      <SelectItem
                        key={item.departmentId}
                        value={item.departmentId.toString()}
                      >
                        {item.department_Name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.departmentId && (
                <p className="text-red-500 font-medium text-sm">{errors.departmentId}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-medium text-lg">
                Password: <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "View"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 font-medium text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword" className="font-medium text-lg">
                Confirm password: <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "View"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

          </div>

          <button
            type="submit"
            className="bg-blue-400 mt-8 text-gray-700 w-full hover:text-gray-600 font-bold hover:bg-blue-300 cursor-pointer rounded py-2 px-4"
          >
            {isValid ? "Submitting..." : "Register"}
          </button>

          {isSubmit && (
            <div className="text-green-500 text-xl font-medium text-center">
              User registered successfully!
            </div>
          )}
        </form>

        <div className="flex text-center text-sm m-auto justify-center gap-1">
          <h5 className="text-gray-400">Already have an account?</h5>
          <a
            href="/login"
            className="text-blue-500 font-bold underline hover:text-blue-400"
          >
            Sign in
          </a>
        </div>
      </div>

      <div className="flex items-center content-center">
        <img
          className="flex items-center imagin rounded-l-4xl"
          src="/original-ba68e98ea10e1867e831884c3b153387.webp"
          alt=""
        />
      </div>
    </div>
  );
};

export default page;

