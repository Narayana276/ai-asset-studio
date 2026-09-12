'use client';

import React from 'react';
import { WorkflowItem } from '../types';
import { 
  Camera, 
  Sparkles, 
  Video, 
  Film, 
  ArrowRight, 
  Clock, 
  Ratio 
} from 'lucide-react';

interface WorkflowCardProps {
  workflow: WorkflowItem;
  onOpen: (workflow: WorkflowItem) => void;
}

export function WorkflowCard({ workflow, onOpen }: WorkflowCardProps) {
  const getIcon = () => {
    switch (workflow.iconName) {
      case 'camera':
        return <Camera className="h-6 w-6 text-emerald-400" />;
      case 'sparkles':
        return <Sparkles className="h-6 w-6 text-blue-400" />;
      case 'video':
        return <Video className="h-6 w-6 text-violet-400" />;
      case 'film':
        return <Film className="h-6 w-6 text-rose-400" />;
      default:
        return <Sparkles className="h-6 w-6 text-indigo-400" />;
    }
  };

  const isVideo = workflow.category === 'video';

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.2] hover:shadow-2xl hover:shadow-indigo-500/10 ${workflow.borderColor}`}
    >
      {/* Background Radial Glow */}
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br ${workflow.gradient} blur-3xl transition-opacity duration-500 opacity-60 group-hover:opacity-100`}
      />

      {/* Card Header Content */}
      <div className="relative z-10">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 pb-4">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wider ${workflow.badgeBg} ${workflow.badgeText}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isVideo ? 'bg-rose-400' : 'bg-emerald-400'
              }`}
            />
            {workflow.categoryLabel}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            <span>{workflow.estimatedTime}</span>
          </div>
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-4 pt-1">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-slate-950/70 shadow-inner group-hover:scale-105 transition-transform duration-300">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-white transition-colors">
              {workflow.title}
            </h3>
            <p className={`text-xs font-medium tracking-wide mt-0.5 ${workflow.accentColor}`}>
              {workflow.tagline}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed text-slate-300/90 line-clamp-3">
          {workflow.description}
        </p>

        {/* Feature Tags */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {workflow.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/[0.06] bg-slate-950/40 px-2 py-0.5 text-[11px] font-medium text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Metadata Specs & CTA Button */}
      <div className="relative z-10 mt-6 pt-5 border-t border-white/[0.06]">
        <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Ratio className="h-3.5 w-3.5 text-slate-500" />
            <span>Ratios: {workflow.aspectRatios[0].split(' ')[0]}</span>
          </span>
          <span className="truncate max-w-[130px] font-mono text-[11px] text-slate-400">
            {workflow.outputFormat.split(' ')[0]}
          </span>
        </div>

        {/* Open Workflow Button */}
        <button
          onClick={() => onOpen(workflow)}
          type="button"
          className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/[0.12] bg-white/[0.05] py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-white/[0.25] hover:bg-white/[0.1] active:scale-[0.99]"
        >
          <span>Open Workflow</span>
          <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover/btn:translate-x-1 group-hover/btn:text-white" />
        </button>
      </div>
    </div>
  );
}
