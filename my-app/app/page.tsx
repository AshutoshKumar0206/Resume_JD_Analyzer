"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ROUTES } from "./api/routes";
import Cookies from "js-cookie";


export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  
  useEffect(() => {
    const userToken = Cookies.get("is_logged_in");
    // const userToken = Cookies.get("user_token");
    console.log(userToken);
    if (!userToken) {
      router.push(ROUTES.LOGIN);
    } else {
      setIsAuthenticated(true);
      setLoading(false);
      router.push(ROUTES.HOME);
    }
  }, [router]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // You can now send this `selectedFile` to your backend using FormData
    }
  };
  
  const handleSignOut = () => {
    Cookies.remove("is_logged_in", { path: '/' });
    // Cookies.remove("user_token", { path: '/' });
    setIsAuthenticated(false);
    router.push(ROUTES.LOGIN);
  };
  


  if (loading) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <main className="relative min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* --- Background Elements --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent" />
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(79,70,229,0.5)]">
               <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
               <span className="font-black text-white text-lg">A</span>
            </div>
            <span className="font-bold tracking-tight text-xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Align<span className="text-indigo-400">.ai</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            {/* <button className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors">Documentation</button> */}
            {/* <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
              Sign In
            </button> */}
            <button 
              onClick={handleSignOut}
              className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-sm font-bold transition-all active:scale-95 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <div className="relative z-10 pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-bold uppercase tracking-widest"
          >
            Powered by Nexus Tech
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6"
          >
            Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Alignment</span>
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Stop guessing. Our AI analyzes your resume against job descriptions to provide a precise compatibility score and actionable tips.
          </motion.p>
        </div>

        {/* --- Main Interface (Bento Grid) --- */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Resume Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-5 relative group rounded-[2rem] border transition-all duration-500 p-1 flex flex-col min-h-[450px] overflow-hidden
              ${dragActive ? "border-indigo-500 shadow-[0_0_40px_rgba(79,70,229,0.15)]" : "border-white/10 bg-white/[0.03]"}
            `}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { 
              e.preventDefault(); 
              setDragActive(false);
              const droppedFile = e.dataTransfer.files?.[0];
              if(droppedFile) setFile(droppedFile);
            }}
          >
            <div className="flex-1 m-4 rounded-[1.5rem] border border-white/5 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
               {/* Animated Pulse */}
               <div className="absolute inset-0 bg-indigo-500/[0.02] animate-pulse" />
               
               <AnimatePresence mode="wait">
                {!file ? (
                  /* --- State 1: No File (Upload Prompt) --- */
                  <motion.div
                    key="upload-prompt"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative z-10"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Drop Resume</h3>
                    <p className="text-slate-500 text-sm max-w-[200px] mx-auto mb-8 leading-relaxed">
                      Support for PDF, Docx, or TXT formats
                    </p>
                    <label className="group/btn relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 cursor-pointer">
                      <span>Browse Files</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.docx,.doc"
                        onChange={(e) => {
                          const selectedFile = e.target.files?.[0];
                          if (selectedFile) setFile(selectedFile);
                        }}
                      />
                    </label>
                  </motion.div>
                ) : (
                  /* --- State 2: File Uploaded (Preview) --- */
                  <motion.div
                    key="file-preview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="relative z-10 w-full flex flex-col items-center"
                  >
                    <div className="relative mb-6">
                      {/* Document Icon Mockup */}
                      <div className="w-24 h-32 bg-slate-800 rounded-xl border border-white/10 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 rounded-bl-xl border-b border-l border-white/5" />
                        <svg className="w-10 h-10 text-indigo-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {file.name.split('.').pop()}
                        </span>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => setFile(null)}
                        className="cursor-pointer absolute -top-3 -right-3 w-8 h-8 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all border border-white/10 shadow-lg z-20"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <h4 className="text-white font-semibold truncate max-w-[220px]">{file.name}</h4>
                    <p className="text-slate-500 text-xs mt-1 mb-4">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>

                    {/* Action Buttons: View & Download */}
                    <div className="flex items-center gap-3 mb-6">
                      <button
                        onClick={() => {
                          const fileURL = URL.createObjectURL(file);
                          window.open(fileURL, "_blank");
                        }}
                        className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/10 hover:text-white transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>

                      <button
                        onClick={() => {
                          const url = URL.createObjectURL(file);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = file.name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/10 hover:text-white transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </div>

                    <div className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      File Uploaded
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* JD Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 rounded-[2rem] border border-white/10 bg-white/[0.03] p-1 flex flex-col min-h-[450px]"
          >
            <div className="flex-1 m-4 rounded-[1.5rem] border border-white/5 bg-slate-900/50 backdrop-blur-sm flex flex-col p-6">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Job Description</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono italic bg-white/5 px-2 py-0.5 rounded-md">
                  Characters: <span className={jobDescription.length > 0 ? "text-indigo-400" : ""}>
                    {jobDescription.length.toLocaleString()}
                  </span>
                </span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job requirements here..."
                className="flex-1 w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-slate-300 placeholder:text-slate-700 resize-none text-lg leading-relaxed custom-scrollbar"
              />
            </div>
          </motion.div>
        </div>

        {/* --- Action Button --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 flex flex-col items-center"
        >
          <button className="cursor-pointer relative group px-16 py-5 bg-white text-black rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white" />
            <span className="relative z-10 flex items-center gap-3">
              Analyze Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          {/* <p className="mt-6 text-slate-600 text-sm flex items-center gap-2">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
             Free for 10 scans per day
          </p> */}
        </motion.div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </main>
  );
}