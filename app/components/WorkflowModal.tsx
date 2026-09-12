'use client';

import React, { useState, useEffect } from 'react';
import { WorkflowItem } from '../types';
import { 
  X, 
  UploadCloud, 
  Check, 
  Info, 
  Zap, 
  Clock 
} from 'lucide-react';

interface WorkflowModalProps {
  workflow: WorkflowItem | null;
  onClose: () => void;
}

export function WorkflowModal({ workflow, onClose }: WorkflowModalProps) {
  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!workflow) return null;

  return (
    <WorkflowModalContent key={workflow.id} workflow={workflow} onClose={onClose} />
  );
}

function WorkflowModalContent({
  workflow,
  onClose,
}: {
  workflow: WorkflowItem;
  onClose: () => void;
}) {
  const [selectedRatio, setSelectedRatio] = useState<string>(workflow.aspectRatios[0]);
  const [selectedQuality, setSelectedQuality] = useState<'Standard 1080p' | 'Production 2K' | 'Master 4K'>('Production 2K');
  const [promptText, setPromptText] = useState<string>(workflow.defaultPrompt);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);

  const handleSimulateRun = () => {
    setIsSimulating(true);
    setSimulationNotice(null);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationNotice(
        'UI Dashboard Prototype: Pipeline parameters configured successfully! Internal model API integration will connect in the next phase.'
      );
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.15] bg-slate-900/95 shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl">
        {/* Top Accent Line */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${workflow.gradient.replace('/20', '').replace('/10', '')}`} />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${workflow.badgeBg} ${workflow.badgeText}`}>
                {workflow.categoryLabel}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                Est: {workflow.estimatedTime}
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white tracking-tight">
              {workflow.title}
            </h2>
            <p className="mt-1 text-xs font-medium text-indigo-300">
              {workflow.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6 text-slate-200">
          {/* Description Box */}
          <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-4 text-xs leading-relaxed text-slate-300">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>{workflow.description}</span>
            </div>
          </div>

          {/* Aspect Ratio Config */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Aspect Ratio Preset
            </label>
            <div className="grid grid-cols-3 gap-2">
              {workflow.aspectRatios.map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setSelectedRatio(ratio)}
                  className={`rounded-xl border py-2.5 px-3 text-xs font-medium transition-all text-center ${
                    selectedRatio === ratio
                      ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-inner'
                      : 'border-white/[0.08] bg-slate-950/40 text-slate-400 hover:border-white/[0.15] hover:text-slate-200'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Tier Preset */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Quality & Sampling Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Standard 1080p', 'Production 2K', 'Master 4K'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setSelectedQuality(tier)}
                  className={`rounded-xl border py-2 px-3 text-xs font-medium transition-all ${
                    selectedQuality === tier
                      ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-inner'
                      : 'border-white/[0.08] bg-slate-950/40 text-slate-400 hover:border-white/[0.15] hover:text-slate-200'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Configuration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Generation Prompt & Directives
              </label>
              <button
                type="button"
                onClick={() => setPromptText(workflow.defaultPrompt)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Reset Default
              </button>
            </div>
            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Describe your desired composition, lighting, materials, and motion..."
              className="w-full rounded-xl border border-white/[0.1] bg-slate-950/70 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Reference Asset Upload Dropzone (Mock) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Input Reference Asset (Optional)
            </label>
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.15] bg-slate-950/30 p-6 text-center hover:border-indigo-500/50 hover:bg-slate-950/50 transition-all cursor-pointer">
              <UploadCloud className="h-7 w-7 text-indigo-400 mb-2" />
              <p className="text-xs font-medium text-slate-200">
                Click to browse or drop reference product / sketch here
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports PNG, JPEG, WEBP, or MP4 up to 100MB
              </p>
            </div>
          </div>

          {/* Status Feedback Notice */}
          {simulationNotice && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-start gap-2.5">
              <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{simulationNotice}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.08] bg-slate-950/60 px-6 py-4">
          <div className="text-[11px] text-slate-400">
            Output: <span className="font-mono text-slate-300">{workflow.outputFormat}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/[0.1] px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.05] transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              disabled={isSimulating}
              onClick={handleSimulateRun}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Configuring Pipeline...</span>
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5" />
                  <span>Launch {workflow.title}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
