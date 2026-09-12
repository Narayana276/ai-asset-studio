'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Server } from 'lucide-react';

export function PipelineSpecs() {
  const specs = [
    {
      title: 'Product Image Pipeline',
      type: 'Image Synthesis',
      checkpoint: 'SD-XL Studio Refiner v4.1',
      resolution: 'Up to 3840 x 3840 (4K)',
      latency: '3.2s average',
      gpuAllocation: '2x NVIDIA A100 (40GB)',
      features: ['Automatic shadow synthesis', 'Alpha channel isolation', 'Color accuracy gamut check'],
    },
    {
      title: 'Lifestyle Image Pipeline',
      type: 'Contextual Composition',
      checkpoint: 'Flux Studio-Pro Interior/Exterior',
      resolution: 'Up to 4096 x 2732',
      latency: '4.8s average',
      gpuAllocation: '2x NVIDIA A100 (40GB)',
      features: ['HDR natural daylight synthesis', 'Perspective alignment matrix', 'Depth map conditioning'],
    },
    {
      title: 'Product Video Pipeline',
      type: 'Camera Motion Synthesis',
      checkpoint: 'AnimateDiff / CogVideoX Orbit-v2',
      resolution: '1920 x 1080 (60 FPS)',
      latency: '14.2s average',
      gpuAllocation: '4x NVIDIA H100 (80GB)',
      features: ['360 orbital camera control', 'Zero temporal jitter filter', 'Seamless looping generator'],
    },
    {
      title: '4-Second Fashion Video Pipeline',
      type: 'Fabric & Kinetic Motion',
      checkpoint: 'MotionCraft Runway-Micro v3.0',
      resolution: '1080 x 1920 (9:16 Vertical)',
      latency: '11.5s average',
      gpuAllocation: '4x NVIDIA H100 (80GB)',
      features: ['Garment drape physics simulation', 'Runway stride cadence lock', 'High-bitrate social export'],
    },
  ];

  return (
    <div className="mt-12 rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 sm:p-8 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-indigo-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Internal Pipeline Architecture
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Current cluster allocation and model checkpoints powering the 4 generation workflows
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 py-1.5 text-xs text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Cluster Fleet Health: 100%</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {specs.map((spec) => (
          <div
            key={spec.title}
            className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{spec.title}</h3>
              <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                {spec.type}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 border-y border-white/[0.04] py-2.5">
              <div>
                <span className="block text-slate-500 text-[10px]">MODEL CHECKPOINT</span>
                <span className="font-mono text-slate-200">{spec.checkpoint}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[10px]">PEAK RESOLUTION</span>
                <span className="font-mono text-slate-200">{spec.resolution}</span>
              </div>
              <div className="mt-1">
                <span className="block text-slate-500 text-[10px]">AVG LATENCY</span>
                <span className="font-mono text-emerald-400">{spec.latency}</span>
              </div>
              <div className="mt-1">
                <span className="block text-slate-500 text-[10px]">NODE ALLOCATION</span>
                <span className="font-mono text-indigo-300">{spec.gpuAllocation}</span>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Pipeline Capabilities
              </span>
              {spec.features.map((feat) => (
                <div key={feat} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <CheckCircle2 className="h-3 w-3 text-indigo-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
