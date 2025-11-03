"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ShieldCheck, Boxes, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center text-center px-6">
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          CDAC Inventory Management System
        </h1>
        <p className="text-gray-600 text-lg mb-8">
Efficiently manage and secure laboratory assets, users, and custodians with a robust, scalable, and intelligent inventory management system designed for streamlined operations and enhanced control.        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Link href="/login">
            <Button className="rounded-xl bg-blue-600 text-white hover:bg-blue-700">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="rounded-xl border-blue-600 text-blue-600 hover:bg-blue-50">
              Sign Up
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl"
      >
        <FeatureCard
          icon={<Boxes className="w-8 h-8 text-blue-600" />}
          title="Smart Inventory Tracking"
          desc="Easily track lab items, quantities, and logs with real-time updates."
        />
        <FeatureCard
          icon={<Users className="w-8 h-8 text-blue-600" />}
          title="Role-Based Access"
          desc="Admins, custodians, and users each get secure, role-based control."
        />
        <FeatureCard
          icon={<Zap className="w-8 h-8 text-blue-600" />}
          title="Fast & Reliable"
          desc="Optimized with Next.js for blazing fast performance and security."
        />
      </motion.div>

      {/* Footer */}
      <footer className="mt-20   text-sm text-gray-500">
        © {new Date().getFullYear()} CDAC Inventory Management System — Built with ❤️ by an Intern
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
      <div className="flex flex-col items-center text-center">
        <div className="mb-3">{icon}</div>
        <h3 className="font-semibold text-gray-800 text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{desc}</p>
      </div>
    </div>
  );
}
