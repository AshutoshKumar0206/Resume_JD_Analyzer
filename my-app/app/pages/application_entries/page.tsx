'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Briefcase, User, Calendar, ExternalLink, ChevronRight, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '@/app/lib/axiosInstance';

export interface Application {
  id: string;
  candidateName: string;
  role: string;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  appliedDate: string;
  resumeUrl: string;
  jdContent: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  
  const fetchAllApplicationEntries = async () => {
    try {
      const response = await axiosInstance.get('/matcher/get-all-entries');
      if(response.data && response.data.success) {
        setApplications(response.data.data);
      } else if(response.data && !response.data.success) {
        console.log(response.data.message);
        toast.success(response.data.message || "Application entries retrieval failed");
      }
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast.error(error?.response?.data?.message || "Error in fetching all application entries");
    }
  }

  useEffect(() => {
    fetchAllApplicationEntries();
  }, [fetchAllApplicationEntries]);

  return (
    /* We use absolute inset-0 to force it to cover the entire layout area */
    <div className="fixed inset-0 bg-[#f8fafc] flex flex-col z-20 overflow-hidden">
      
      {/* Header - Full Width */}
      <header className="w-full bg-white border-b border-slate-200 px-8 py-6 flex-shrink-0">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Application Entries</h1>
            <p className="text-slate-500 text-sm">Reviewing {applications.length} total candidates</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full md:w-80"
            />
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable area that takes remaining height */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1600px] mx-auto space-y-4 pb-12">
          {applications.map((app) => (
            <ApplicationRowCard 
              key={app.id}
              app={app}
              onViewJD={() => setSelectedApp(app)}
              onViewResume={() => window.open(app.resumeUrl, '_blank')}
            />
          ))}
        </div>
      </main>

      {/* Slide-over Detail Pane */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedApp.candidateName}</h2>
                <p className="text-blue-600 font-medium">{selectedApp.role}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ChevronRight size={24} className="text-slate-500" />
              </button>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-400 italic">Job description content goes here...</p>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ApplicationRowCard({ app, onViewJD, onViewResume }: { app: Application, onViewJD: () => void, onViewResume: () => void }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-400 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-6 flex-1 w-full">
        <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-lg">
          <User size={26} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-900 truncate">{app.candidateName}</h3>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-1">
            <span className="flex items-center text-slate-500 font-medium">
              <Briefcase size={16} className="mr-2 text-blue-500" />
              {app.role}
            </span>
            <span className="flex items-center text-slate-500 font-medium">
              <Calendar size={16} className="mr-2 text-purple-500" />
              {app.appliedDate}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
        <button 
          onClick={onViewResume}
          className="cursor-pointer flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
        >
          <FileText size={18} />
          Resume
        </button>
        <button 
          onClick={onViewJD}
          className="cursor-pointer flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
        >
          View JD
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}