'use client';

import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.08] bg-slate-950/70 py-8 text-xs text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600/20 text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold text-slate-300">Internal AI Asset Generation Studio</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-500">v1.0.4 Enterprise</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-emerald-400" />
            <span>Confidential • Internal Use Only</span>
          </span>
          <span>•</span>
          <span>Cluster Region: US-East GPU Pool</span>
        </div>
      </div>
    </footer>
  );
}
