'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { WorkflowCard } from './components/WorkflowCard';
import { WorkflowModal } from './components/WorkflowModal';
import { ProductImageModal } from './components/ProductImageModal';
import { LifestyleImageModal } from './components/LifestyleImageModal';
import { ProductVideoModal } from './components/ProductVideoModal';
import { FashionVideoModal } from './components/FashionVideoModal';
import { TemplateLibraryView } from './components/TemplateLibraryView';
import { ProviderSettingsView } from './components/ProviderSettingsView';
import { AssetDetailModal } from './components/AssetDetailModal';
import { RecentGenerations } from './components/RecentGenerations';
import { PipelineSpecs } from './components/PipelineSpecs';
import { Footer } from './components/Footer';
import { WORKFLOWS, RECENT_ASSETS } from './data/workflows';
import { WorkflowItem, WorkflowCategory, RecentAsset } from './types';
import { Layers, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'ai_studio_recent_assets';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>('workflows');
  const [selectedFilter, setSelectedFilter] = useState<'all' | WorkflowCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowItem | null>(null);
  
  // Persistent recent assets with fallback to default RECENT_ASSETS (loaded from localStorage in browser)
  const [recentAssets, setRecentAssets] = useState<RecentAsset[]>(() => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to read recent assets from localStorage', e);
      }
    }
    return RECENT_ASSETS;
  });
  const [inspectingAsset, setInspectingAsset] = useState<RecentAsset | null>(null);

  const handleSaveAsset = (newAsset: RecentAsset) => {
    setRecentAssets((prev) => {
      const updated = [newAsset, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 30)));
      } catch (e) {
        console.warn('Failed to save recent asset to localStorage', e);
      }
      return updated;
    });
  };

  const handleOpenWorkflowById = (workflowId: string) => {
    const targetWf = WORKFLOWS.find((w) => w.id === workflowId);
    if (targetWf) {
      setActiveWorkflow(targetWf);
    }
  };

  // Filter workflows based on category tab & search query
  const filteredWorkflows = useMemo(() => {
    return WORKFLOWS.filter((wf) => {
      // Category filter
      if (selectedFilter !== 'all' && wf.category !== selectedFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = wf.title.toLowerCase().includes(q);
        const matchesDesc = wf.description.toLowerCase().includes(q);
        const matchesTagline = wf.tagline.toLowerCase().includes(q);
        const matchesTags = wf.tags.some((t) => t.toLowerCase().includes(q));
        return matchesTitle || matchesDesc || matchesTagline || matchesTags;
      }
      return true;
    });
  }, [selectedFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col justify-between relative">
      {/* Background Decorative Gradients & Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-10 left-10 h-[450px] w-[450px] rounded-full bg-cyan-600/10 blur-[140px]" />
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex-1">
        {/* Navigation Bar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Hero Section with Filter Controls (Shown on Workflows view) */}
        {activeTab === 'workflows' && (
          <HeroBanner
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* Dashboard Main View Container */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Active Tab View Conditionals */}
          {activeTab === 'workflows' && (
            <div>
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-indigo-400" />
                    <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                      Production Workflows
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Select any pipeline card to launch configuration, inspect parameters, and prepare generations.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="rounded-md border border-white/[0.08] bg-slate-900/60 px-2.5 py-1 font-mono text-[11px] text-indigo-300">
                    Showing {filteredWorkflows.length} of {WORKFLOWS.length} Workflows
                  </span>
                </div>
              </div>

              {/* 4 Main Workflow Cards Grid */}
              {filteredWorkflows.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {filteredWorkflows.map((workflow) => (
                    <WorkflowCard
                      key={workflow.id}
                      workflow={workflow}
                      onOpen={(wf) => setActiveWorkflow(wf)}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state when search/filter returns nothing */
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-slate-900/30 p-12 text-center">
                  <AlertCircle className="h-10 w-10 text-slate-500 mb-3" />
                  <h3 className="text-sm font-semibold text-white">No workflows match your search</h3>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm">
                    No active pipelines found for &ldquo;{searchQuery}&rdquo;. Try clearing your query or adjusting category filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('all');
                    }}
                    className="mt-4 rounded-xl border border-white/[0.12] bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white hover:bg-white/[0.1] transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Quick Pipeline Guidelines Ribbon */}
              <div className="mt-10 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900/40 to-slate-950/40 p-4 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        Creative Tip for Internal Production
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        For e-commerce packshots, use <span className="text-emerald-300 font-medium">Product Image</span> with Alpha Cutout. For social ads, choose <span className="text-rose-300 font-medium">4-Second Fashion Video</span> with 9:16 vertical ratio.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('pipelines')}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 shrink-0 cursor-pointer"
                  >
                    <span>View Architecture Specs</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Recent Generations Component */}
              <RecentGenerations 
                assets={recentAssets} 
                onSelectAsset={(asset) => setInspectingAsset(asset)}
              />
            </div>
          )}

          {activeTab === 'templates' && (
            <div>
              <TemplateLibraryView 
                onSelectWorkflow={(wfId) => {
                  setActiveTab('workflows');
                  handleOpenWorkflowById(wfId);
                }} 
              />
            </div>
          )}

          {activeTab === 'recent' && (
            <div>
              <RecentGenerations 
                assets={recentAssets} 
                onSelectAsset={(asset) => setInspectingAsset(asset)}
              />
            </div>
          )}

          {activeTab === 'pipelines' && (
            <div>
              <PipelineSpecs />
            </div>
          )}

          {activeTab === 'providers' && (
            <div>
              <ProviderSettingsView />
            </div>
          )}
        </main>
      </div>

      {/* Dedicated Product Image Workflow Studio Modal */}
      <ProductImageModal
        isOpen={activeWorkflow?.id === 'product-image'}
        onClose={() => setActiveWorkflow(null)}
        onSaveAsset={handleSaveAsset}
      />

      {/* Dedicated Lifestyle Image Workflow Studio Modal */}
      <LifestyleImageModal
        isOpen={activeWorkflow?.id === 'lifestyle-image'}
        onClose={() => setActiveWorkflow(null)}
        onSaveAsset={handleSaveAsset}
      />

      {/* Dedicated Product Video Workflow Studio Modal */}
      <ProductVideoModal
        isOpen={activeWorkflow?.id === 'product-video'}
        onClose={() => setActiveWorkflow(null)}
        onSaveAsset={handleSaveAsset}
      />

      {/* Dedicated 4-Second Fashion Video Workflow Studio Modal */}
      <FashionVideoModal
        isOpen={activeWorkflow?.id === 'fashion-video'}
        onClose={() => setActiveWorkflow(null)}
        onSaveAsset={handleSaveAsset}
      />

      {/* Interactive Workflow Configuration Modal for other pipelines */}
      <WorkflowModal
        workflow={
          activeWorkflow?.id !== 'product-image' &&
          activeWorkflow?.id !== 'lifestyle-image' &&
          activeWorkflow?.id !== 'product-video' &&
          activeWorkflow?.id !== 'fashion-video'
            ? activeWorkflow
            : null
        }
        onClose={() => setActiveWorkflow(null)}
      />

      {/* Asset Inspection & Download Detail Modal */}
      <AssetDetailModal
        asset={inspectingAsset}
        onClose={() => setInspectingAsset(null)}
      />

      {/* Studio Footer */}
      <Footer />
    </div>
  );
}
