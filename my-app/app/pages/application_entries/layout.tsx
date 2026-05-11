"use client";

import BackButton from "@/app/components/ui/backButton";
import React from "react";

export default function ApplicationEntriesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* 1. Background Ambient Glows - Fixed Z-Index */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      {/* 2. Optional: Noise/Grain Texture Overlay for that premium feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* 3. Auth Content Container */}
      <div className="w-full max-w-md relative z-10 flex flex-col gap-6">
        {/* Container for BackButton to ensure spacing */}
        <div className="flex justify-start">
          <BackButton label="Back to Home" />
        </div>
        
        {/* The dynamic content (Login/Signup cards) */}
        <main className="w-full animate-in fade-in zoom-in-95 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}