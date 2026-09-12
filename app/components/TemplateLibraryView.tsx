'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  ExternalLink, 
  Tag, 
  Code, 
  Layers, 
  Search
} from 'lucide-react';
import { PROMPT_TEMPLATES, PromptTemplateItem } from '../data/templateLibrary';

interface TemplateLibraryViewProps {
  onSelectWorkflow?: (workflowId: string) => void;
}

export function TemplateLibraryView({ onSelectWorkflow }: TemplateLibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'image' | 'video'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = PROMPT_TEMPLATES.filter((tmpl) => {
    const matchesFilter = selectedFilter === 'all' || tmpl.type === selectedFilter;
    const matchesQuery = 
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesQuery;
  });

  const handleCopy = (tmpl: PromptTemplateItem) => {
    navigator.clipboard.writeText(tmpl.promptTemplate);
    setCopiedId(tmpl.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <FileText className="w-3.5 h-3.5" />
            Centralized Prompt & Directives Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Prompt Template Library
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Inspect, test, and adapt the structured prompt formulas powering each AI Asset Studio workflow.
            Every template features parametric variables (<code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">{'{variable}'}</code>)
            that dynamically synthesize production-ready generation directives.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="relative z-10 mt-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates or tags..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 border border-slate-800 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Formats ({PROMPT_TEMPLATES.length})
            </button>
            <button
              onClick={() => setSelectedFilter('image')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === 'image'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Images (2)
            </button>
            <button
              onClick={() => setSelectedFilter('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === 'video'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Videos (2)
            </button>
          </div>
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between space-y-5 hover:border-slate-700 transition-all shadow-lg"
          >
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-2 ${
                    tmpl.type === 'video'
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                  }`}>
                    {tmpl.categoryLabel}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {tmpl.name}
                  </h3>
                </div>

                <button
                  onClick={() => handleCopy(tmpl)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
                  title="Copy raw template formula"
                >
                  {copiedId === tmpl.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedId === tmpl.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {tmpl.description}
              </p>

              {/* Template Formula Box */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Code className="w-3 h-3 text-indigo-400" />
                  Formula Architecture
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 text-xs font-mono text-indigo-200/90 leading-relaxed select-all">
                  {tmpl.promptTemplate}
                </div>
              </div>

              {/* Parametric Variables Table */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3 text-purple-400" />
                  Parametric Variables ({tmpl.variables.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {tmpl.variables.map((v) => (
                    <div 
                      key={v.key}
                      className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-amber-300">{`{${v.key}}`}</span>
                        <span className="text-[10px] text-slate-400">{v.label}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 truncate" title={v.defaultValue}>
                        Default: <span className="text-slate-300 font-mono">{v.defaultValue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tmpl.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 text-[10px] font-medium flex items-center gap-1"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Open Workflow Action */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Workflow ID: <code className="text-slate-300 font-mono">{tmpl.workflowId}</code>
              </span>
              {onSelectWorkflow && (
                <button
                  onClick={() => onSelectWorkflow(tmpl.workflowId)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Launch Workflow
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
