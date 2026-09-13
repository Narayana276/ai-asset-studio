'use client';

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Film, 
  Image as ImageIcon, 
  Layers, 
  Cpu
} from 'lucide-react';
import { RecentAsset } from '../types';

interface AssetDetailModalProps {
  asset: RecentAsset | null;
  onClose: () => void;
}

export function AssetDetailModal({ asset, onClose }: AssetDetailModalProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!asset) return null;

  const isVideo = asset.type === 'video';
  const assetImageSrc = asset.imageUrl || (asset as any).videoGraphicUrl || '';

  const handleCopyPrompt = () => {
    if (asset.prompt) {
      navigator.clipboard.writeText(asset.prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!assetImageSrc) return;
    const link = document.createElement('a');
    link.href = assetImageSrc;
    link.download = `${asset.id}_${asset.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isVideo 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {isVideo ? <Film className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white truncate max-w-md">{asset.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isVideo ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {asset.type}
                </span>
              </div>
              <p className="text-xs text-slate-400">Asset ID: {asset.id} • Created {asset.timestamp}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto p-6 gap-6">
          
          {/* Left: Asset Visual Preview Canvas */}
          <div className="md:col-span-6 flex flex-col items-center justify-center bg-slate-950 rounded-2xl border border-slate-800 p-4 relative group">
            <div className="relative w-full max-h-[420px] aspect-square flex items-center justify-center overflow-hidden rounded-xl bg-slate-900/50">
              {assetImageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={assetImageSrc} 
                  alt={asset.title}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-xl"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    {isVideo ? <Film className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                  </div>
                  <p className="text-xs text-slate-400">No visual preview attached</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-3 w-full">
              <button
                onClick={handleDownload}
                disabled={!assetImageSrc}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                Export Vector Graphic
              </button>
            </div>
          </div>

          {/* Right: Metadata, Prompt & Specifications */}
          <div className="md:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Prompt Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Generation Prompt
                  </label>
                  <button
                    onClick={handleCopyPrompt}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedPrompt ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed max-h-32 overflow-y-auto">
                  {asset.prompt}
                </div>
              </div>

              {/* Core Parameters Table */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Asset Metadata & Specifications
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">FORMAT</span>
                    <span className="text-slate-200 font-semibold">{asset.type.toUpperCase()}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">ASPECT RATIO</span>
                    <span className="text-slate-200 font-semibold">{asset.aspectRatio}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">RESOLUTION</span>
                    <span className="text-slate-200 font-semibold">{asset.dimensions}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">SEED NUMBER</span>
                    <span className="text-amber-400 font-semibold">{asset.seed ? `#${asset.seed}` : 'N/A'}</span>
                  </div>
                  {asset.duration && (
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">DURATION</span>
                      <span className="text-rose-400 font-semibold">{asset.duration}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Extra Metadata Attributes */}
              {asset.metadata && Object.keys(asset.metadata).length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    Workflow Directives
                  </label>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs">
                    {Object.entries(asset.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 capitalize">{key}:</span>
                        <span className="text-slate-300 font-medium truncate max-w-[200px]">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer close */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
