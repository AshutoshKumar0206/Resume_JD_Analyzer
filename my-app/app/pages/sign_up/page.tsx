"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/api/routes";
import axios from "axios";
import { toast } from "react-toastify";

export default function SignUpPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const validations = [
    { label: "12+ Characters", met: password.length >= 12 },
    { label: "Upper & Lowercase", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: "Numeric Digit (0-9)", met: /\d/.test(password) },
    { label: "Special Character (!@#$)", met: /[^A-Za-z0-9]/.test(password) },
    { label: "No common patterns (123/abc)", met: !/(123|abc|qwerty|password)/i.test(password) },
  ];
  
  // Calculate percentage for a single overall progress bar (optional)
  const strengthScore = validations.filter(v => v.met).length;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/auth/signup", {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      {
        // Configuration object
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, 
      });

      console.log(response);
      const data = response.data;

      if (data && data.success) {
        toast.success(data.message || "Signup successful");
        router.push(ROUTES.HOME);
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  // Staggered animation variants for form elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-emerald-500/5 rounded-full blur-[120px]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-5xl font-black text-white mb-3 tracking-tighter">
            Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Align.ai</span>
          </h1>
          <p className="text-slate-400 font-medium">Build a career-ready profile in seconds.</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-1 shadow-2xl"
        >
          <div className="bg-[#020617]/40 rounded-[2.3rem] p-8">
            <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all shadow-inner"
                  />
                </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  placeholder="hello@nexus.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type Password..."
                  autoComplete="new-password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all shadow-inner"
                />
                
                {/* Visual Password Strength Bar */}
                <div className="flex gap-1.5 px-1 pt-1">
                  {[1, 2, 3, 4].map((step) => {
                    // Define our color sequence
                    const colors = ["bg-red-500", "bg-violet-500", "bg-blue-500", "bg-emerald-500"];
                    const shadows = [
                      "shadow-[0_0_8px_rgba(239,68,68,0.5)]",
                      "shadow-[0_0_8px_rgba(139,92,246,0.5)]",
                      "shadow-[0_0_8px_rgba(59,130,246,0.5)]",
                      "shadow-[0_0_8px_rgba(16,185,129,0.5)]",
                    ];

                    const isActive = password.length > step * 3;

                    return (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                          password.length === 0
                            ? "bg-white/10" // Empty state
                            : isActive
                            ? `${colors[step - 1]} ${shadows[step - 1]}` // Active color + glow
                            : "bg-white/20" // Inactive state
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Type Password as above..."
                  value={confirmPassword}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all shadow-inner"
                />
              </div>

              <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-indigo-50 transition-all active:scale-[0.98] mt-6 shadow-xl shadow-white/5 cursor-pointer">
                Create Account
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-slate-500 text-xs">
                Already have an account?{" "}
                <Link href={ROUTES.LOGIN} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.p variants={itemVariants} className="mt-8 text-center text-white text-[10px] px-8 leading-relaxed uppercase tracking-tighter">
          By creating an account, you acknowledge the Nexus Tech <span className="text-slate-400 underline cursor-pointer">Security Protocol</span>.
        </motion.p>
      </motion.div>
    </main>
  );
}