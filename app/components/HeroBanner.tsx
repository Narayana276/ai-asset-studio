'use client';

import React from 'react';
import { Search, Sparkles, Image as ImageIcon, Video as VideoIcon, LayoutGrid } from 'lucide-react';
import { WorkflowCategory } from '../types';

interface HeroBannerProps {
  selectedFilter: 'all' | WorkflowCategory;
  setSelectedFilter: (filter: 'all' | WorkflowCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function HeroBanner({
  selectedFilter,
  setSelectedFilter,
  searchQuery,
  setSearchQuery,
}: HeroBannerProps) {
  return (
    <div className="relative border-b border-white/[0.08] pb-10 pt-8 sm:pt-12 overflow-hidden">
      {/* Background Lighting Accents */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-3/4 max-w-4xl rounded-full bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Tag */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI Visual Asset Generator • Studio Engine v1.0</span>
          </div>
        </div>

        {/* Header Heading */}
        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Internal AI Asset Studio
            </h1>
            <p className="mt-3 text-base text-slate-300/90 sm:text-lg sm:leading-relaxed">
              Synthesize studio-grade e-commerce product imagery, contextual lifestyle backdrops,
              and cinematic high-conversion video assets using unified generative pipelines.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex shrink-0 items-center gap-4 rounded-xl border border-white/[0.08] bg-slate-900/50 p-3 backdrop-blur-md">
            <div className="text-center px-2">
              <span className="block text-xl font-bold text-white">4</span>
              <span className="text-[11px] text-slate-400">Pipelines</span>
            </div>
            <div className="h-8 w-[1px] bg-white/[0.08]" />
            <div className="text-center px-2">
              <span className="block text-xl font-bold text-emerald-400">4K</span>
              <span className="text-[11px] text-slate-400">Ultra-HD</span>
            </div>
            <div className="h-8 w-[1px] bg-white/[0.08]" />
            <div className="text-center px-2">
              <span className="block text-xl font-bold text-indigo-400">60 FPS</span>
              <span className="text-[11px] text-slate-400">Motion</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-slate-900/80 p-1 backdrop-blur-md">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>All Workflows</span>
              <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px]">4</span>
            </button>
            <button
              onClick={() => setSelectedFilter('image')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedFilter === 'image'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span>Image Engines</span>
              <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px]">2</span>
            </button>
            <button
              onClick={() => setSelectedFilter('video')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedFilter === 'video'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <VideoIcon className="h-3.5 w-3.5 text-rose-400" />
              <span>Video Engines</span>
              <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px]">2</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search workflows, specs, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-slate-900/60 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
