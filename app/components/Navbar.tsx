'use client';

import React from 'react';
import { Sparkles, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-slate-950">
                <Sparkles className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">
                  AssetStudio<span className="text-indigo-400">.ai</span>
                </span>
                <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                  Internal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Enterprise Visual Generation</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 border-l border-white/[0.08] pl-6">
            <button
              onClick={() => setActiveTab('workflows')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'workflows'
                  ? 'bg-white/[0.08] text-white shadow-inner'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              Workflows
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-white/[0.08] text-white shadow-inner'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              Template Library
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'recent'
                  ? 'bg-white/[0.08] text-white shadow-inner'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              Recent Assets
            </button>
            <button
              onClick={() => setActiveTab('pipelines')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'pipelines'
                  ? 'bg-white/[0.08] text-white shadow-inner'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              Pipeline Specs
            </button>
            <button
              onClick={() => setActiveTab('providers')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'providers'
                  ? 'bg-white/[0.08] text-white shadow-inner'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              AI Providers
            </button>
          </nav>
        </div>

        {/* Right Status & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Cluster Status Pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>GPU Cluster: 99.8% Online</span>
          </div>

          <div className="h-4 w-[1px] bg-white/[0.08] hidden sm:block" />

          {/* Quick Info & User */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-medium text-slate-200">Creative Production</span>
              <span className="text-[10px] text-slate-400">Internal Team Node</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.1] bg-gradient-to-br from-slate-800 to-slate-900 text-xs font-semibold text-slate-200 shadow-sm">
              CP
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
