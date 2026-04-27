"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ROUTES } from "../api/routes";

interface BackButtonProps {
  label?: string;
  destination?: string;
}

export default function BackButton({ label = "Back" }: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        router.push(ROUTES.HOME); // Clean and type-safe
    };

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: -4 }}
      onClick={() => handleBack}
      className="group flex items-center gap-3 text-slate-500 hover:text-white transition-colors text-sm font-medium cursor-pointer mb-8"
    >
      <div className="w-9 h-9 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center group-hover:bg-indigo-600/20 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all duration-300 shadow-lg">
        <svg 
          className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <span className="tracking-wide uppercase text-[10px] font-bold opacity-70 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
    </motion.button>
  );
}