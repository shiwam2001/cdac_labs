"use client";

import React, { useState } from "react";
import { login } from "../actions/action1";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsValid(true);
    setError(null);

    const { email, password } = formData;
    if (!email || !password) {
      setError("All fields are required");
      setIsValid(false);
      return;
    }

    const result = await login({ email, password });
    if (!result?.success) {
      setError(result?.message || "Something went wrong. Try again.");
      setIsValid(false);
      return;
    }

    setIsValid(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[90%] max-w-lg    backdrop-blur-md    rounded-2xl p-8 sm:p-10"
      >
        {/* Logo + Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <Image
            src="/cdacLogo.png"
            width={100}
            height={100}
            alt="CDAC Logo"
            className="mb-4"
          />
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            CDAC Inventory Management
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Sign in to manage your lab inventory
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="focus-visible:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs text-blue-600 hover:text-blue-500 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                onChange={handleChange}
                required
                className="focus-visible:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2 text-gray-500 text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-center text-red-500 font-semibold">
              {error}
            </p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isValid}
            className="bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg w-full mt-2 py-2"
          >
            {isValid ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Sign up link */}
        <p className="text-sm text-center text-gray-600 mt-6">
          New user?{" "}
          <a
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Create an account
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
