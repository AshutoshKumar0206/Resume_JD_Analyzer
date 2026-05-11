"use client";

import BackButton from "@/app/components/ui/backButton";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Shared Background Ambient Glows for all Auth Pages */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] -z-0" />

      {/* Auth Content Container */}
      <div className="w-full max-w-md relative z-10">
        {/* The BackButton is now global for all routes in this layout folder */}
        <BackButton label="Back to Home" />
        
        {/* This renders the specific page (Login or Signup) */}
        {children}
      </div>
    </div>
  );
}