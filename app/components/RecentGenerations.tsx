
'use client';

import React, { useEffect, useState } from 'react';
import { RECENT_ASSETS } from '../data/workflows';
import { RecentAsset } from '../types';
import { Image as ImageIcon, Video, Download, CheckCircle2 } from 'lucide-react';

interface RecentGenerationsProps {
  assets?: RecentAsset[];
  onSelectAsset?: (asset: RecentAsset) => void;
}

export function RecentGenerations({ assets = RECENT_ASSETS, onSelectAsset }: RecentGenerationsProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  if (!mounted) return null;
  return (
    <div className="mt-14 border-t border-white/[0.08] pt-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Recent Studio Generations
            </h2>
            <span className="rounded-full border border-white/[0.1] bg-white/[0.05] px-2 py-0.5 text-[10px] font-semibold text-slate-400">
              Live Queue ({assets.length})
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Latest visual assets rendered across active studio pipelines. Click any asset to inspect metadata and export.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Automated Cache Synced</span>
        </div>
      </div>

      {/* Grid of recent assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => onSelectAsset && onSelectAsset(asset)}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.08] bg-slate-900/40 p-4 backdrop-blur-md hover:border-indigo-500/50 hover:bg-slate-900/70 transition-all cursor-pointer shadow-lg"
          >
            {/* Thumbnail Preview Area */}
            <div className={`relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-gradient-to-br ${asset.gradientBg} border border-white/[0.05] flex items-center justify-center p-2 text-center`}>
              {asset.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.imageUrl}
                  alt={asset.title}
                  className="h-full w-full object-contain rounded transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  {asset.type === 'video' ? (
                    <Video className="h-6 w-6 text-violet-400" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-emerald-400" />
                  )}
                  <span className="text-[11px] font-medium text-slate-200 line-clamp-1">
                    {asset.title}
                  </span>
                  <span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                    {asset.dimensions} {asset.duration ? `• ${asset.duration}` : ''}
                  </span>
                </div>
              )}

              {/* Status Badge in thumbnail */}
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 backdrop-blur-sm">
                <CheckCircle2 className="h-3 w-3" />
                {asset.status}
              </div>
            </div>

            {/* Asset Metadata */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="font-semibold text-indigo-300">{asset.workflowTitle}</span>
                <span>{asset.timestamp}</span>
              </div>
              <p className="text-xs font-medium text-white truncate">{asset.title}</p>
            </div>

            {/* Actions */}
            <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px]">
              <span className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-slate-400">
                {asset.tag}
              </span>
              <span className="text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1 font-semibold">
                Inspect <Download className="h-3 w-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
