'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Zap, 
  RotateCw, 
  Copy, 
  Bookmark, 
  Check, 
  Video, 
  Layers, 
  Sun, 
  Palette, 
  Maximize2, 
  RefreshCw, 
  Clock,
  AlertCircle,
  Play,
  Pause,
  UploadCloud,
  FileCheck,
  Film
} from 'lucide-react';
import { 
  VIDEO_PRODUCT_OPTIONS,
  VIDEO_STYLE_OPTIONS,
  CAMERA_MOVEMENT_OPTIONS,
  VIDEO_BACKGROUND_OPTIONS,
  VIDEO_LIGHTING_OPTIONS,
  VIDEO_ASPECT_RATIO_OPTIONS,
  VIDEO_QUALITY_OPTIONS,
  buildProductVideoPrompt
} from '../data/productVideoConfig';
import { videoGenerationService, VideoGenerationResponse } from '../services/videoGeneration';
import { RecentAsset } from '../types';

interface ProductVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAsset?: (asset: RecentAsset) => void;
}

export function ProductVideoModal({ isOpen, onClose, onSaveAsset }: ProductVideoModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return <ProductVideoModalContent onClose={onClose} onSaveAsset={onSaveAsset} />;
}

function ProductVideoModalContent({ 
  onClose, 
  onSaveAsset 
}: { 
  onClose: () => void;
  onSaveAsset?: (asset: RecentAsset) => void;
}) {
  // Option states
  const [selectedProduct, setSelectedProduct] = useState(VIDEO_PRODUCT_OPTIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState(VIDEO_STYLE_OPTIONS[0]);
  const [selectedCamera, setSelectedCamera] = useState(CAMERA_MOVEMENT_OPTIONS[0]);
  const [selectedBg, setSelectedBg] = useState(VIDEO_BACKGROUND_OPTIONS[0]);
  const [selectedLighting, setSelectedLighting] = useState(VIDEO_LIGHTING_OPTIONS[0]);
  const [selectedRatio, setSelectedRatio] = useState(VIDEO_ASPECT_RATIO_OPTIONS[0]);
  const [selectedQuality, setSelectedQuality] = useState(VIDEO_QUALITY_OPTIONS[1]); // Default 2K

  // Optional reference asset simulation
  const [referenceAsset, setReferenceAsset] = useState<string | null>(null);

  // Prompt state
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [promptText, setPromptText] = useState(() =>
    buildProductVideoPrompt({
      product: VIDEO_PRODUCT_OPTIONS[0].name,
      style: VIDEO_STYLE_OPTIONS[0].name,
      camera: CAMERA_MOVEMENT_OPTIONS[0].name,
      background: VIDEO_BACKGROUND_OPTIONS[0].name,
      lighting: VIDEO_LIGHTING_OPTIONS[0].name,
      quality: VIDEO_QUALITY_OPTIONS[1].label,
    })
  );

  // Sync prompt with selections unless manually edited
  const syncPrompt = (
    prod = selectedProduct,
    style = selectedStyle,
    cam = selectedCamera,
    bg = selectedBg,
    light = selectedLighting,
    qual = selectedQuality
  ) => {
    const autoPrompt = buildProductVideoPrompt({
      product: prod.name,
      style: style.name,
      camera: cam.name,
      background: bg.name,
      lighting: light.name,
      quality: qual.label,
    });
    setPromptText(autoPrompt);
    setIsManualEdit(false);
  };

  const handleProductChange = (prod: typeof VIDEO_PRODUCT_OPTIONS[0]) => {
    setSelectedProduct(prod);
    if (!isManualEdit) syncPrompt(prod, selectedStyle, selectedCamera, selectedBg, selectedLighting, selectedQuality);
  };

  const handleStyleChange = (style: typeof VIDEO_STYLE_OPTIONS[0]) => {
    setSelectedStyle(style);
    if (!isManualEdit) syncPrompt(selectedProduct, style, selectedCamera, selectedBg, selectedLighting, selectedQuality);
  };

  const handleCameraChange = (cam: typeof CAMERA_MOVEMENT_OPTIONS[0]) => {
    setSelectedCamera(cam);
    if (!isManualEdit) syncPrompt(selectedProduct, selectedStyle, cam, selectedBg, selectedLighting, selectedQuality);
  };

  const handleBgChange = (bg: typeof VIDEO_BACKGROUND_OPTIONS[0]) => {
    setSelectedBg(bg);
    if (!isManualEdit) syncPrompt(selectedProduct, selectedStyle, selectedCamera, bg, selectedLighting, selectedQuality);
  };

  const handleLightingChange = (light: typeof VIDEO_LIGHTING_OPTIONS[0]) => {
    setSelectedLighting(light);
    if (!isManualEdit) syncPrompt(selectedProduct, selectedStyle, selectedCamera, selectedBg, light, selectedQuality);
  };

  const handleQualityChange = (qual: typeof VIDEO_QUALITY_OPTIONS[0]) => {
    setSelectedQuality(qual);
    if (!isManualEdit) syncPrompt(selectedProduct, selectedStyle, selectedCamera, selectedBg, selectedLighting, qual);
  };

  const handleResetToTemplate = () => {
    syncPrompt(selectedProduct, selectedStyle, selectedCamera, selectedBg, selectedLighting, selectedQuality);
  };

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<VideoGenerationResponse | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [variationCount, setVariationCount] = useState(0);

  // Video playback preview state
  const [isPlaying, setIsPlaying] = useState(true);

  const runGeneration = async (isVariation = false) => {
    setIsGenerating(true);
    setIsSaved(false);
    setGenerationError(null);
    setGenerationStep(1);

    // Realistic multi-stage progress simulation
    const stepTimer1 = setTimeout(() => setGenerationStep(2), 450);
    const stepTimer2 = setTimeout(() => setGenerationStep(3), 950);
    const stepTimer3 = setTimeout(() => setGenerationStep(4), 1400);

    try {
      const nextVar = isVariation ? variationCount + 1 : 0;
      setVariationCount(nextVar);

      const result = await videoGenerationService.generate({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        styleId: selectedStyle.id,
        styleName: selectedStyle.name,
        cameraMovementId: selectedCamera.id,
        cameraMovementName: selectedCamera.name,
        backgroundId: selectedBg.id,
        backgroundName: selectedBg.name,
        lightingId: selectedLighting.id,
        lightingName: selectedLighting.name,
        aspectRatioId: selectedRatio.id,
        resolution: selectedRatio.resolution,
        qualityId: selectedQuality.id,
        qualityName: selectedQuality.label,
        prompt: promptText,
        referenceAssetName: referenceAsset || undefined,
        seed: isVariation ? generatedResult?.seed : undefined,
        variationIndex: nextVar,
      });

      setGeneratedResult(result);
      setIsPlaying(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Video generation pipeline failed. Please retry.';
      setGenerationError(msg);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  const handleLaunch = () => {
    runGeneration(false);
  };

  const handleRegenerate = () => {
    runGeneration(false);
  };

  const handleCreateVariation = () => {
    runGeneration(true);
  };

  const handleSave = () => {
    if (!generatedResult) return;
    setIsSaved(true);

    if (onSaveAsset) {
      onSaveAsset({
        id: generatedResult.id,
        title: `${generatedResult.productName} 360 Spin Reel`,
        workflowTitle: 'Product Video',
        type: 'video',
        dimensions: generatedResult.resolution,
        duration: generatedResult.duration,
        timestamp: 'Just now',
        status: 'Ready',
        gradientBg: 'from-violet-950/60 to-slate-900',
        tag: `Seed #${generatedResult.seed.toString().slice(0, 5)}`,
        imageUrl: generatedResult.videoGraphicUrl,
        prompt: generatedResult.prompt,
        seed: generatedResult.seed,
      });
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Window */}
      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-2xl border border-violet-500/30 bg-slate-900/95 shadow-2xl shadow-violet-950/50 backdrop-blur-2xl flex flex-col">
        {/* Top Glowing Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400 shadow-inner">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Product Video Studio
                </h2>
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                  Motion Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Render 360° rotational motion reels, macro pushes, and lighting sweeps with zero temporal jitter.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white"
            title="Close modal (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: 2-Column Split Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
          
          {/* Left Column: Configuration Controls & Prompt */}
          <div className="lg:col-span-7 p-6 space-y-6 overflow-y-auto">
            
            {/* 1. Product Subject */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                  <span>1. Product Subject</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedProduct.name}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {VIDEO_PRODUCT_OPTIONS.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleProductChange(prod)}
                    className={`flex flex-col text-left p-2.5 rounded-xl border transition-all ${
                      selectedProduct.id === prod.id
                        ? 'border-violet-500 bg-violet-500/15 text-white shadow-inner ring-1 ring-violet-500/50'
                        : 'border-white/[0.08] bg-slate-950/40 text-slate-300 hover:border-white/[0.18] hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="text-xs font-semibold line-clamp-1">{prod.name}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{prod.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Video Style */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                  <Film className="h-3.5 w-3.5" />
                  <span>2. Video Motion Style</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedStyle.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {VIDEO_STYLE_OPTIONS.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => handleStyleChange(style)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      selectedStyle.id === style.id
                        ? 'border-violet-500 bg-violet-500/20 text-white shadow-sm ring-1 ring-violet-500/40'
                        : 'border-white/[0.08] bg-slate-950/40 text-slate-300 hover:border-white/[0.15] hover:text-white'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Camera Movement */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>3. Camera Trajectory</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedCamera.name}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CAMERA_MOVEMENT_OPTIONS.map((cam) => (
                  <button
                    key={cam.id}
                    type="button"
                    onClick={() => handleCameraChange(cam)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      selectedCamera.id === cam.id
                        ? 'border-violet-500 bg-violet-500/15 text-white ring-1 ring-violet-500/50'
                        : 'border-white/[0.08] bg-slate-950/40 text-slate-300 hover:border-white/[0.15]'
                    }`}
                  >
                    <span className="block text-xs font-semibold">{cam.name}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{cam.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Background / Environment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  <span>4. Stage Background & Floor</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedBg.name}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VIDEO_BACKGROUND_OPTIONS.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => handleBgChange(bg)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all text-left ${
                      selectedBg.id === bg.id
                        ? 'border-violet-500 bg-violet-500/15 text-white ring-1 ring-violet-500/50'
                        : 'border-white/[0.08] bg-slate-950/40 text-slate-300 hover:border-white/[0.15]'
                    }`}
                  >
                    <div 
                      className="h-6 w-6 shrink-0 rounded-md border border-white/20 shadow-sm"
                      style={{ backgroundColor: bg.previewColor || '#090d16' }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold truncate">{bg.name}</span>
                      <span className="block text-[10px] text-slate-400 truncate">{bg.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Studio Lighting */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                  <Sun className="h-3.5 w-3.5" />
                  <span>5. Dynamic Studio Lighting</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedLighting.name}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VIDEO_LIGHTING_OPTIONS.map((light) => (
                  <button
                    key={light.id}
                    type="button"
                    onClick={() => handleLightingChange(light)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      selectedLighting.id === light.id
                        ? 'border-violet-500 bg-violet-500/15 text-white ring-1 ring-violet-500/50'
                        : 'border-white/[0.08] bg-slate-950/40 text-slate-300 hover:border-white/[0.15]'
                    }`}
                  >
                    <span className="block text-xs font-semibold">{light.name}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{light.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Aspect Ratio & 7. Quality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Aspect Ratio */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5 mb-2">
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>6. Aspect Ratio</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {VIDEO_ASPECT_RATIO_OPTIONS.map((ratio) => (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => setSelectedRatio(ratio)}
                      className={`py-2 px-2 rounded-xl border text-center transition-all ${
                        selectedRatio.id === ratio.id
                          ? 'border-violet-500 bg-violet-500/20 text-white font-bold ring-1 ring-violet-500/50'
                          : 'border-white/[0.08] bg-slate-950/40 text-slate-400 hover:border-white/[0.15] hover:text-slate-200'
                      }`}
                    >
                      <span className="block text-xs">{ratio.id}</span>
                      <span className="block text-[9px] text-slate-400 font-mono mt-0.5">{ratio.label.split(' ')[1] || ''}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality & Encoding */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5 mb-2">
                  <Palette className="h-3.5 w-3.5" />
                  <span>7. Quality & Codec</span>
                </label>
                <div className="space-y-1.5">
                  {VIDEO_QUALITY_OPTIONS.map((qual) => (
                    <button
                      key={qual.id}
                      type="button"
                      onClick={() => handleQualityChange(qual)}
                      className={`w-full py-1.5 px-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                        selectedQuality.id === qual.id
                          ? 'border-violet-500 bg-violet-500/20 text-white font-medium ring-1 ring-violet-500/40'
                          : 'border-white/[0.08] bg-slate-950/40 text-slate-400 hover:border-white/[0.15]'
                      }`}
                    >
                      <span>{qual.label}</span>
                      <span className="font-mono text-[10px] text-slate-400">{qual.details.split('•')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 8. Optional Reference Asset Dropzone */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>8. Optional Reference Asset</span>
                </label>
                {referenceAsset && (
                  <button
                    type="button"
                    onClick={() => setReferenceAsset(null)}
                    className="text-[10px] text-rose-400 hover:text-rose-300"
                  >
                    Remove Reference
                  </button>
                )}
              </div>
              
              {referenceAsset ? (
                <div className="flex items-center justify-between rounded-xl border border-violet-500/30 bg-violet-500/10 p-3 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-violet-400" />
                    <span className="font-mono text-xs">{referenceAsset}</span>
                  </div>
                  <span className="rounded bg-violet-950/80 px-2 py-0.5 font-mono text-[10px] text-violet-300">
                    Ready for Conditioning
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => setReferenceAsset(`${selectedProduct.id}-cad-model-v1.glb`)}
                  className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.15] bg-slate-950/30 p-4 text-center hover:border-violet-500/50 hover:bg-slate-950/50 transition-all cursor-pointer"
                >
                  <UploadCloud className="h-6 w-6 text-violet-400 mb-1" />
                  <p className="text-xs font-medium text-slate-200">
                    Click to attach product CAD or hero reference image
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Supports PNG, GLB, OBJ, or MP4 up to 250MB
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic Prompt Template & Review Section */}
            <div className="rounded-xl border border-white/[0.1] bg-slate-950/60 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Synthesized Video Motion Directives
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {isManualEdit ? (
                    <button
                      type="button"
                      onClick={handleResetToTemplate}
                      className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                      title="Reset manual changes and sync from options"
                    >
                      <RotateCw className="h-3 w-3" />
                      <span>Re-sync Template</span>
                    </button>
                  ) : (
                    <span className="rounded-full bg-violet-500/10 border border-violet-500/30 px-2 py-0.5 text-[10px] text-violet-400 font-mono">
                      Auto-Synchronized
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedPrompt ? <Check className="h-3 w-3 text-violet-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Variable Chips Preview */}
              <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-400 font-mono">
                <span className="bg-violet-950/60 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded">
                  &#123;quality&#125;
                </span>
                <span className="bg-purple-950/60 border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                  &#123;product&#125;
                </span>
                <span className="bg-indigo-950/60 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">
                  &#123;style&#125;
                </span>
                <span className="bg-cyan-950/60 border border-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">
                  &#123;camera&#125;
                </span>
                <span className="bg-blue-950/60 border border-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                  &#123;background&#125;
                </span>
                <span className="bg-amber-950/60 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                  &#123;lighting&#125;
                </span>
              </div>

              {/* Editable Textarea */}
              <textarea
                rows={3}
                value={promptText}
                onChange={(e) => {
                  setPromptText(e.target.value);
                  setIsManualEdit(true);
                }}
                placeholder="Review or customize your video motion prompt..."
                className="w-full rounded-xl border border-white/[0.1] bg-slate-900/90 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 leading-relaxed font-sans"
              />

              <p className="text-[11px] text-slate-400 italic">
                {isManualEdit 
                  ? 'Custom edits applied. Click "Re-sync Template" to reload from selection pills above.' 
                  : 'Options above dynamically populate variables in the predefined template.'}
              </p>
            </div>

            {/* Error Banner if generation failed */}
            {generationError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block">Video Generation Error</span>
                  <span className="text-[11px] text-rose-300/90">{generationError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setGenerationError(null)}
                  className="text-rose-400 hover:text-rose-200 text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Primary Action Button */}
            <div>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleLaunch}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-3 px-6 text-sm font-bold text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:from-violet-500 hover:to-purple-500 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span>Generating Video... Stage {generationStep || 1} of 4</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 text-violet-200 fill-violet-200" />
                    <span>Launch Product Video</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Video Preview & Post-Gen Actions */}
          <div className="lg:col-span-5 p-6 bg-slate-950/40 flex flex-col justify-between space-y-6">
            
            {/* Header of Preview Column */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Video Reel Preview
                  </span>
                  {generatedResult && (
                    <span className="rounded bg-violet-500/15 border border-violet-500/30 px-1.5 py-0.2 text-[10px] font-mono text-violet-400 font-semibold">
                      {generatedResult.fps} FPS
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  {generatedResult ? `${generatedResult.resolution} • ${generatedResult.duration}` : selectedRatio.resolution}
                </div>
              </div>
            </div>

            {/* Central Video Player Canvas Area */}
            <div className="flex-1 flex items-center justify-center min-h-[300px]">
              {isGenerating ? (
                /* 4-Stage simulated video rendering loader */
                <div className="w-full flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-2xl border border-violet-500/20 bg-slate-900/60 backdrop-blur-md">
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-20" />
                    <div className="h-12 w-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <Video className="h-6 w-6 animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Generating Video Reel...
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {generationStep <= 1 && 'Stage 1/4: Initializing temporal latents & 3D camera trajectory...'}
                      {generationStep === 2 && 'Stage 2/4: Synthesizing continuous 60 FPS motion keyframes...'}
                      {generationStep === 3 && 'Stage 3/4: Rendering volumetric lighting passes & reflections...'}
                      {generationStep >= 4 && 'Stage 4/4: Encoding video stream to high-bitrate output...'}
                    </p>
                  </div>

                  <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 transition-all duration-500" 
                      style={{ 
                        width: generationStep <= 1 ? '25%' : generationStep === 2 ? '50%' : generationStep === 3 ? '75%' : '96%' 
                      }}
                    />
                  </div>
                </div>
              ) : generatedResult ? (
                /* Generated Animated Video Result Player */
                <div className="w-full flex flex-col items-center">
                  <div className="group relative w-full max-w-sm rounded-2xl border border-white/[0.15] overflow-hidden shadow-2xl bg-slate-950 transition-all duration-300 hover:border-violet-500/40">
                    
                    {/* Animated Video Canvas */}
                    <div className="relative aspect-video w-full overflow-hidden flex items-center justify-center bg-slate-950">
                      <style>{`
                        @keyframes productCrossfade4 {
                          0% { opacity: 0; }
                          5% { opacity: 1; }
                          25% { opacity: 1; }
                          30% { opacity: 0; }
                          100% { opacity: 0; }
                        }
                        @keyframes productPan {
                          0% { transform: scale(1.02) translate(0, 0); }
                          100% { transform: scale(1.1) translate(2%, -1%); }
                        }
                      `}</style>
                      
                      {generatedResult.videoGraphicUrl.split('|').map((src, i, arr) => (
                        <img 
                          key={i}
                          src={src} 
                          alt={`${generatedResult.productName} frame ${i}`}
                          className={`absolute inset-0 w-full h-full object-cover origin-center ${isPlaying ? '' : 'hidden'}`}
                          style={isPlaying ? {
                            opacity: 0,
                            animation: `productCrossfade4 ${arr.length}s linear infinite, productPan ${arr.length * 2}s ease-in-out infinite alternate`,
                            animationDelay: `${i * 1}s, 0s`
                          } : {}}
                        />
                      ))}
                      
                      {/* Fallback for paused state */}
                      {!isPlaying && (
                        <img 
                          src={generatedResult.videoGraphicUrl.split('|')[0]} 
                          alt={generatedResult.productName}
                          className="absolute inset-0 w-full h-full object-cover grayscale-[20%]"
                        />
                      )}

                      {/* Variation Watermark Badge if active */}
                      {generatedResult.variationIndex > 0 && (
                        <div className="absolute top-3 left-3 rounded-md border border-purple-500/50 bg-purple-950/85 px-2 py-0.5 text-[10px] font-mono text-purple-300 backdrop-blur-md shadow">
                          Variation #{generatedResult.variationIndex}
                        </div>
                      )}

                      {/* Camera Motion Trajectory Tag */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-md border border-violet-500/40 bg-slate-950/80 px-2 py-0.5 text-[10px] font-medium text-violet-300 backdrop-blur-md">
                        <Check className="h-3 w-3" />
                        <span className="truncate max-w-[130px]">{generatedResult.meta.motionTrajectory.split('(')[0]}</span>
                      </div>

                      {/* Interactive Video Playback HUD Overlay */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex flex-col gap-1.5">
                        {/* Animated Progress Bar */}
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className={`h-full bg-violet-400 ${isPlaying ? 'w-full transition-all duration-1000' : 'w-2/3'}`} />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="rounded-full bg-white/10 p-1 hover:bg-white/20 transition-colors"
                              title={isPlaying ? 'Pause preview' : 'Play preview'}
                            >
                              {isPlaying ? <Pause className="h-3 w-3 text-white" /> : <Play className="h-3 w-3 text-white" />}
                            </button>
                            <span className="font-mono text-[10px] text-slate-300">
                              {generatedResult.duration} / {generatedResult.duration}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                            <span className="rounded bg-black/60 px-1.5 py-0.5 text-violet-300 border border-violet-500/30">
                              Seamless Loop
                            </span>
                            <span>{generatedResult.fps} FPS</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Canvas Metadata Strip */}
                    <div className="border-t border-white/[0.08] bg-slate-950/90 px-4 py-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="truncate max-w-[140px]">Seed: #{generatedResult.seed}</span>
                      <span className="text-violet-400 font-semibold">{generatedResult.resolution}</span>
                    </div>

                    {/* Summary Card Details */}
                    <div className="p-3 bg-slate-900/60 border-t border-white/[0.04] text-[11px] space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>Quality Preset:</span>
                        <span className="text-slate-200 font-medium">{generatedResult.qualityName}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Codec & Bitrate:</span>
                        <span className="text-slate-200 font-mono text-[10px]">{generatedResult.meta.codec}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Initial Blank Placeholder */
                <div className="w-full flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-white/[0.1] bg-slate-900/30">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-slate-950/50 text-slate-500 mb-3">
                    <Video className="h-6 w-6" />
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200">
                    Ready to Synthesize Video Reel
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                    Select product subject, camera trajectory, background, and quality, review the prompt, and click <strong className="text-violet-400">Launch Product Video</strong>.
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>Latency: ~1.8s (Mock Video Synthesis Engine)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Post-Generation Action Controls: Regenerate, Create Variation, Save */}
            {generatedResult && !isGenerating && (
              <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                {/* Status Notice if Saved */}
                {isSaved && (
                  <div className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 p-2.5 text-xs text-violet-300">
                    <Check className="h-4 w-4 text-violet-400 shrink-0" />
                    <span>Video saved! View it in Recent Studio Generations queue.</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  {/* Regenerate Button */}
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.05] py-2 px-2.5 text-xs font-semibold text-slate-200 hover:bg-white/[0.1] hover:text-white transition-all cursor-pointer"
                    title="Regenerate with a fresh seed"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                    <span>Regenerate</span>
                  </button>

                  {/* Create Variation Button */}
                  <button
                    type="button"
                    onClick={handleCreateVariation}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 py-2 px-2.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 hover:text-white transition-all cursor-pointer"
                    title="Generate an alternate camera trajectory variation"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                    <span>Variation</span>
                  </button>

                  {/* Save Button */}
                  <button
                    type="button"
                    onClick={handleSave}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      isSaved
                        ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                        : 'border-white/[0.12] bg-white/[0.05] text-slate-200 hover:bg-white/[0.1] hover:text-white'
                    }`}
                    title="Save video to internal studio library"
                  >
                    {isSaved ? <Check className="h-3.5 w-3.5 text-violet-400" /> : <Bookmark className="h-3.5 w-3.5 text-slate-400" />}
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bottom info footer */}
            <div className="pt-2 text-center text-[10px] text-slate-400">
              Internal AI Asset Studio • {generatedResult?.meta.renderEngine || 'Mock AI Video Synthesis Engine v3.2'}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
