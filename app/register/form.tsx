"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Role } from "@prisma/client";
import createUser, { Action } from "../actions/action1";
import { Department } from "../admin/laboratory/main";
import { toast } from "sonner";
import { motion } from "framer-motion";
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

const RegisterPage = ({ departmentDetails }: Props) => {
  const registerSchema = z
    .object({
      name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
      email: z
        .string()
        .email("Invalid email address")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email"),
      employeeId: z
        .string()
        .min(1, "Employee ID is required")
        .regex(/^[A-Za-z0-9]+$/, "Employee ID must be alphanumeric"),
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

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
      if (!res?.success) {
        if (res.message?.includes("Email")) {
          setErrors((prev) => ({ ...prev, email: res.message || "Email already in use" }));
        } else if (res.message?.includes("Employee ID")) {
          setErrors((prev) => ({ ...prev, employeeId: res.message || "Employee ID already in use" }));
        } else {
          setErrors((prev) => ({ ...prev, general: res.message || "Something went wrong" }));
        }
        setIsValid(false);
        return;
      }
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
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-blue-50 via-white to-blue-100 ">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row bg-white/70 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden w-[90%] max-w-5xl"
      >
        {/* Left side (Form Section) */}
        <div className="flex-1 p-10 overflow-y-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-2 text-gray-800"
          >
            Register at CDAC IMS
          </motion.h1>

          {/* ✅ Registration Instructions Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5 text-sm text-gray-700"
          >
            <h2 className="font-semibold text-blue-700 mb-2">Instructions for Registration:</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fill in your **official employee details** carefully.</li>
              <li>Use your **organization email address** (e.g., name@cdac.in).</li>
              <li>Your **password** must include uppercase, lowercase, number, and a special character.</li>
              <li>After registration, your account will be **reviewed and approved** by the Admin.</li>
              <li>Once approved, you can log in to access your assigned laboratories.</li>
            </ul>
          </motion.div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField id="name" label="Employee Name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="Full Name" />
            <FormField id="employeeId" label="Employee ID" value={formData.employeeId} onChange={handleChange} error={errors.employeeId} placeholder="Employee ID" />
            <FormField id="email" label="Email Address" value={formData.email} onChange={handleChange} error={errors.email} placeholder="example@cdac.in" />

            {/* Department */}
            <div className="flex flex-col gap-1">
              <label htmlFor="departmentId" className="font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
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
                    <SelectItem value="none" disabled>
                      No departments available
                    </SelectItem>
                  ) : (
                    deptDetail.map((item) => (
                      <SelectItem key={item.departmentId} value={item.departmentId.toString()}>
                        {item.department_Name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.departmentId && (
                <p className="text-red-500 text-sm">{errors.departmentId}</p>
              )}
            </div>

            <PasswordField
              id="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              showPassword={showPassword}
              togglePassword={() => setShowPassword((prev) => !prev)}
              error={errors.password}
            />

            <PasswordField
              id="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              showPassword={showPassword}
              togglePassword={() => setShowPassword((prev) => !prev)}
              error={errors.confirmPassword}
            />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
            >
              {isValid ? "Submitting..." : "Register"}
            </motion.button>

            {isSubmit && (
              <p className="text-green-600 text-center font-medium mt-2">
                User registered successfully!
              </p>
            )}
          </form>

          <div className="text-sm text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-semibold underline">
              Sign in
            </a>
          </div>
        </div>

        {/* Right side (Image Section) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex flex-1 bg-gradient-to-tr from-blue-200 via-blue-100 to-blue-50 items-center justify-center"
        >
          <img
            src="/original-ba68e98ea10e1867e831884c3b153387.webp"
            alt="CDAC Inventory"
            className="w-[90%] rounded-2xl shadow-lg"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

// Subcomponents
function FormField({ id, label, value, onChange, error, placeholder }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-medium text-gray-700">
        {label}: <span className="text-red-500">*</span>
      </label>
      <Input id={id} value={value} onChange={onChange} placeholder={placeholder} required />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function PasswordField({ id, label, value, onChange, showPassword, togglePassword, error }: any) {
  return (
    <div className="flex flex-col  gap-1">
      <label htmlFor={id} className="font-medium text-gray-700">
        {label}: <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={label}
          required
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-2 text-gray-500 text-sm hover:text-gray-700"
        >
          {showPassword ? "Hide" : "View"}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

export default RegisterPage;
