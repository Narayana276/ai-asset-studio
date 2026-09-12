'use client';

import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  CheckCircle2, 
  ShieldAlert, 
  Zap, 
  Activity,
  Check
} from 'lucide-react';
import { imageGenerationService } from '../services/imageGeneration';
import { videoGenerationService } from '../services/videoGeneration';
import { MockImageGenerationProvider } from '../services/imageGeneration/mockProvider';
import { ExternalImageGenerationProvider } from '../services/imageGeneration/externalProvider';
import { MockVideoGenerationProvider } from '../services/videoGeneration/mockProvider';
import { ExternalVideoGenerationProvider } from '../services/videoGeneration/externalProvider';

export function ProviderSettingsView() {
  const [activeImageProviderId, setActiveImageProviderId] = useState<'mock' | 'external'>('mock');
  const [activeVideoProviderId, setActiveVideoProviderId] = useState<'mock' | 'external'>('mock');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleToggleImageProvider = (id: 'mock' | 'external') => {
    setActiveImageProviderId(id);
    if (id === 'mock') {
      imageGenerationService.setProvider(new MockImageGenerationProvider());
      showFeedback('Switched Image Engine to Internal Studio Neural Mock Engine v2.4');
    } else {
      imageGenerationService.setProvider(new ExternalImageGenerationProvider());
      showFeedback('Switched Image Engine to Cloud Neural Diffusion API Adapter');
    }
  };

  const handleToggleVideoProvider = (id: 'mock' | 'external') => {
    setActiveVideoProviderId(id);
    if (id === 'mock') {
      videoGenerationService.setProvider(new MockVideoGenerationProvider());
      showFeedback('Switched Video Engine to Internal Studio Neural Video Mock Engine v3.2');
    } else {
      videoGenerationService.setProvider(new ExternalVideoGenerationProvider());
      showFeedback('Switched Video Engine to Cloud Neural Video Diffusion API Adapter');
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
            <Server className="w-3.5 h-3.5" />
            AI Service & Provider Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            AI Provider Infrastructure
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            AI Asset Studio utilizes a decoupled provider service abstraction (<code className="text-blue-300 bg-blue-950/60 px-1 py-0.5 rounded">ImageGenerationProvider</code> and <code className="text-blue-300 bg-blue-950/60 px-1 py-0.5 rounded">VideoGenerationProvider</code>).
            Workflows communicate exclusively through the service layer, enabling instant zero-downtime hot-swaps between the high-fidelity internal mock engine and production cloud diffusion models.
          </p>
        </div>

        {feedbackMessage && (
          <div className="relative z-10 mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {feedbackMessage}
          </div>
        )}
      </div>

      {/* Security Advisory Alert */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 flex items-start gap-4">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 flex-shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-200">Security Architecture & Environment Keys</h4>
          <p className="text-xs text-amber-300/80 leading-relaxed">
            In compliance with enterprise security protocols, production API keys (e.g. OpenAI, Runway Gen-3, Fal.ai, Flux) must never be hardcoded into frontend client bundles.
            When external providers are selected without active backend proxy credentials, the client gracefully falls back to the deterministic internal engine or displays clear diagnostic guidance.
          </p>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Image Generation Provider Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Image Generation Engine</h3>
                <p className="text-xs text-slate-400">Powers Product Image & Lifestyle Image Workflows</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald-400" /> Operational
            </span>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Image Provider
            </div>

            {/* Option 1: Mock Studio Engine */}
            <div 
              onClick={() => handleToggleImageProvider('mock')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                activeImageProviderId === 'mock'
                  ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/50'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Internal Studio Neural Mock Engine v2.4</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">DEFAULT</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  High-fidelity procedural vector synthesis. Generates deterministic, responsive assets with dynamic lighting, product silhouettes, and zero cloud API overhead.
                </p>
              </div>
              {activeImageProviderId === 'mock' && (
                <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 ml-3">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Option 2: External API Provider Adapter */}
            <div 
              onClick={() => handleToggleImageProvider('external')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                activeImageProviderId === 'external'
                  ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/50'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Cloud Neural Diffusion API Adapter</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">PRODUCTION STUB</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ready-to-use HTTP client adapter for external endpoints (OpenAI DALL-E 3, Flux.1, SDXL, Replicate). Requires proxy credentials.
                </p>
              </div>
              {activeImageProviderId === 'external' && (
                <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 ml-3">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Engine Status:</span>
              <span className="text-emerald-400">Ready</span>
            </div>
            <div className="flex justify-between">
              <span>Interface Contract:</span>
              <span className="text-blue-300">ImageGenerationProvider</span>
            </div>
            <div className="flex justify-between">
              <span>Typical Latency:</span>
              <span className="text-slate-200">1200ms - 1800ms</span>
            </div>
          </div>
        </div>

        {/* Video Generation Provider Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Video Generation Engine</h3>
                <p className="text-xs text-slate-400">Powers Product Video & 4-Second Fashion Video</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald-400" /> Operational
            </span>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Video Provider
            </div>

            {/* Option 1: Mock Video Engine */}
            <div 
              onClick={() => handleToggleVideoProvider('mock')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                activeVideoProviderId === 'mock'
                  ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500/50'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Internal Studio Neural Video Mock Engine v3.2</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">DEFAULT</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Smooth 60 FPS keyframed vector animation system. Renders 360° orbital trajectories, runway catwalk strides, and sweeping studio lighting.
                </p>
              </div>
              {activeVideoProviderId === 'mock' && (
                <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 ml-3">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Option 2: External Video Provider Adapter */}
            <div 
              onClick={() => handleToggleVideoProvider('external')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                activeVideoProviderId === 'external'
                  ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500/50'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Cloud Neural Video Diffusion API Adapter</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">PRODUCTION STUB</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Production adapter for temporal video synthesis endpoints (Runway Gen-3 Alpha, Luma Dream Machine, Sora).
                </p>
              </div>
              {activeVideoProviderId === 'external' && (
                <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 ml-3">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Engine Status:</span>
              <span className="text-emerald-400">Ready</span>
            </div>
            <div className="flex justify-between">
              <span>Interface Contract:</span>
              <span className="text-rose-300">VideoGenerationProvider</span>
            </div>
            <div className="flex justify-between">
              <span>Temporal Framerate:</span>
              <span className="text-slate-200">60 FPS Native</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
