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
  User,
  Film
} from 'lucide-react';
import { 
  FASHION_PRODUCT_OPTIONS,
  FASHION_STYLE_OPTIONS,
  FASHION_MODEL_OPTIONS,
  FASHION_BACKGROUND_OPTIONS,
  FASHION_CAMERA_OPTIONS,
  FASHION_LIGHTING_OPTIONS,
  FASHION_ASPECT_RATIO_OPTIONS,
  FASHION_QUALITY_OPTIONS,
  FASHION_VIDEO_DURATION,
  buildFashionVideoPrompt
} from '../data/fashionVideoConfig';
import { videoGenerationService, VideoGenerationResponse } from '../services/videoGeneration';
import { RecentAsset } from '../types';

interface FashionVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAsset?: (asset: RecentAsset) => void;
}

export function FashionVideoModal({ isOpen, onClose, onSaveAsset }: FashionVideoModalProps) {
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

  return <FashionVideoModalContent onClose={onClose} onSaveAsset={onSaveAsset} />;
}

function FashionVideoModalContent({ 
  onClose, 
  onSaveAsset 
}: { 
  onClose: () => void;
  onSaveAsset?: (asset: RecentAsset) => void;
}) {
  // Option states (Default 9:16 aspect ratio for social/mobile content)
  const [selectedProduct, setSelectedProduct] = useState(FASHION_PRODUCT_OPTIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState(FASHION_STYLE_OPTIONS[0]);
  const [selectedModel, setSelectedModel] = useState(FASHION_MODEL_OPTIONS[0]);
  const [selectedBg, setSelectedBg] = useState(FASHION_BACKGROUND_OPTIONS[0]);
  const [selectedCamera, setSelectedCamera] = useState(FASHION_CAMERA_OPTIONS[0]);
  const [selectedLighting, setSelectedLighting] = useState(FASHION_LIGHTING_OPTIONS[0]);
  const [selectedRatio, setSelectedRatio] = useState(FASHION_ASPECT_RATIO_OPTIONS[0]); // 9:16 default
  const [selectedQuality, setSelectedQuality] = useState(FASHION_QUALITY_OPTIONS[1]); // 2K default

  const [referenceAsset, setReferenceAsset] = useState<string | null>(null);

  // Prompt state
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [promptText, setPromptText] = useState(() =>
    buildFashionVideoPrompt({
      product: FASHION_PRODUCT_OPTIONS[0].name,
      model: FASHION_MODEL_OPTIONS[0].name,
      style: FASHION_STYLE_OPTIONS[0].name,
      background: FASHION_BACKGROUND_OPTIONS[0].name,
      camera: FASHION_CAMERA_OPTIONS[0].name,
      lighting: FASHION_LIGHTING_OPTIONS[0].name,
    })
  );

  const syncPrompt = (
    prod = selectedProduct,
    model = selectedModel,
    style = selectedStyle,
    bg = selectedBg,
    cam = selectedCamera,
    light = selectedLighting
  ) => {
    const autoPrompt = buildFashionVideoPrompt({
      product: prod.name,
      model: model.name,
      style: style.name,
      background: bg.name,
      camera: cam.name,
      lighting: light.name,
    });
    setPromptText(autoPrompt);
    setIsManualEdit(false);
  };

  const handleProductChange = (prod: typeof FASHION_PRODUCT_OPTIONS[0]) => {
    setSelectedProduct(prod);
    if (!isManualEdit) syncPrompt(prod, selectedModel, selectedStyle, selectedBg, selectedCamera, selectedLighting);
  };

  const handleModelChange = (model: typeof FASHION_MODEL_OPTIONS[0]) => {
    setSelectedModel(model);
    if (!isManualEdit) syncPrompt(selectedProduct, model, selectedStyle, selectedBg, selectedCamera, selectedLighting);
  };

  const handleStyleChange = (style: typeof FASHION_STYLE_OPTIONS[0]) => {
    setSelectedStyle(style);
    if (!isManualEdit) syncPrompt(selectedProduct, selectedModel, style, selectedBg, selectedCamera, selectedLighting);
  };

  const handleBgChange = (bg: typeof FASHION_BACKGROUND_OPTIONS[0]) => {
    setSelectedBg(bg);
    if (!isManualEdit) syncPrompt(selectedProduct, selectedModel, selectedStyle, bg, selectedCamera, selectedLighting);
  };

  const handleCameraChange = (cam: typeof FASHION_CAMERA_OPTIONS[0]) => {
    setSelectedCamera(cam);
    if (!isManualEdit) syncPrompt(selectedProduct, selectedModel, selectedStyle, selectedBg, cam, selectedLighting);
  };

  const handleLightingChange = (light: typeof FASHION_LIGHTING_OPTIONS[0]) => {
    setSelectedLighting(light);
    if (!isManualEdit) syncPrompt(selectedProduct, selectedModel, selectedStyle, selectedBg, selectedCamera, light);
  };

  // Generation status state
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStage, setGenStage] = useState('');
  const [genProgress, setGenProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Active video state
  const [generatedVideo, setGeneratedVideo] = useState<VideoGenerationResponse | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Video generation logic
  const handleGenerate = async (overrideSeed?: number, overrideVariation?: number) => {
    setIsGenerating(true);
    setError(null);
    setSavedSuccess(false);

    // Realistic fashion reel generation pipeline progression
    setGenStage('Analyzing model posture and fabric kinematics...');
    setGenProgress(20);

    const stageTimer1 = setTimeout(() => {
      setGenStage('Synthesizing 60 FPS 9:16 mobile catwalk sequence...');
      setGenProgress(55);
    }, 550);

    const stageTimer2 = setTimeout(() => {
      setGenStage('Rendering runway spotlight caustics and fabric drape...');
      setGenProgress(85);
    }, 1100);

    try {
      const response = await videoGenerationService.generate({
        workflowType: 'fashion-video',
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        modelId: selectedModel.id,
        modelName: selectedModel.name,
        styleId: selectedStyle.id,
        styleName: selectedStyle.name,
        backgroundId: selectedBg.id,
        backgroundName: selectedBg.name,
        cameraMovementId: selectedCamera.id,
        cameraMovementName: selectedCamera.name,
        lightingId: selectedLighting.id,
        lightingName: selectedLighting.name,
        aspectRatioId: selectedRatio.id,
        resolution: selectedRatio.resolution,
        qualityId: selectedQuality.id,
        qualityName: selectedQuality.label,
        prompt: promptText,
        referenceAssetName: referenceAsset || undefined,
        seed: overrideSeed,
        variationIndex: overrideVariation ?? (generatedVideo ? generatedVideo.variationIndex + 1 : 0),
      });

      setGenProgress(100);
      setGenStage('Finalizing 4-second fashion render...');
      setGeneratedVideo(response);
      setIsPlaying(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Video generation failed';
      setError(message);
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    const newSeed = Math.floor(10000000 + Math.random() * 90000000);
    handleGenerate(newSeed, 0);
  };

  const handleCreateVariation = () => {
    const currentSeed = generatedVideo ? generatedVideo.seed : Math.floor(Math.random() * 90000000);
    const nextVariation = generatedVideo ? generatedVideo.variationIndex + 1 : 1;
    handleGenerate(currentSeed, nextVariation);
  };

  const handleCopyPrompt = () => {
    const textToCopy = generatedVideo ? generatedVideo.prompt : promptText;
    navigator.clipboard.writeText(textToCopy);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleSaveToRecent = () => {
    if (!generatedVideo) return;

    const newAsset: RecentAsset = {
      id: generatedVideo.id,
      title: `${selectedProduct.name} - 4s Fashion Reel`,
      workflowTitle: '4-Second Fashion Video',
      type: 'video',
      dimensions: generatedVideo.resolution,
      duration: FASHION_VIDEO_DURATION,
      timestamp: 'Just now',
      status: 'Ready',
      gradientBg: 'from-rose-950/60 to-slate-900',
      tag: `Seed #${generatedVideo.seed.toString().slice(0, 5)}`,
      imageUrl: generatedVideo.videoGraphicUrl,
      prompt: generatedVideo.prompt,
      seed: generatedVideo.seed,
      aspectRatio: generatedVideo.aspectRatio,
      metadata: {
        product: generatedVideo.productName,
        style: generatedVideo.styleName,
        camera: generatedVideo.cameraMovementName,
        lighting: generatedVideo.lightingName,
        background: generatedVideo.backgroundName,
        quality: generatedVideo.qualityName,
        duration: FASHION_VIDEO_DURATION,
        model: selectedModel.name,
      }
    };

    if (onSaveAsset) {
      onSaveAsset(newAsset);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSimulateUploadReference = () => {
    if (referenceAsset) {
      setReferenceAsset(null);
    } else {
      setReferenceAsset('moodboard_couture_ref_01.mp4');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fashion-modal-title"
    >
      <div 
        className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-rose-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="fashion-modal-title" className="text-lg font-bold text-white tracking-tight">
                  4-Second Fashion Video Studio
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Fixed 0:04 Micro-Reel
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Mobile 9:16 Native
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate dynamic 4-second viral runway reels with kinematic fabric physics and mobile-first framing.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* Left Column: Configuration Controls */}
          <div className="lg:col-span-7 p-6 space-y-6 overflow-y-auto max-h-[calc(92vh-80px)]">
            
            {/* 1. Garment / Fashion Product Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                1. Garment / Fashion Silhouette
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FASHION_PRODUCT_OPTIONS.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => handleProductChange(prod)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedProduct.id === prod.id
                        ? 'border-rose-500 bg-rose-500/10 shadow-sm shadow-rose-500/20 ring-1 ring-rose-500/50'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="font-semibold text-sm text-slate-200">{prod.name}</div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{prod.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Model & Presentation Motion */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-pink-400" />
                2. Model & Cadence Presentation
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FASHION_MODEL_OPTIONS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelChange(model)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedModel.id === model.id
                        ? 'border-pink-500 bg-pink-500/10 ring-1 ring-pink-500/50'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-medium text-xs text-slate-200">{model.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{model.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Fashion Style & Runway Direction */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                3. Fashion & Runway Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FASHION_STYLE_OPTIONS.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleStyleChange(style)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedStyle.id === style.id
                        ? 'border-purple-500 bg-purple-500/10 ring-1 ring-purple-500/50'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-medium text-xs text-slate-200">{style.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Runway Catwalk Environment */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                4. Runway Stage / Environment
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FASHION_BACKGROUND_OPTIONS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => handleBgChange(bg)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      selectedBg.id === bg.id
                        ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/50'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {bg.previewColor && (
                        <div 
                          className="w-3 h-3 rounded-full border border-slate-600 flex-shrink-0"
                          style={{ backgroundColor: bg.previewColor }}
                        />
                      )}
                      <span className="font-medium text-xs text-slate-200 truncate">{bg.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-2">{bg.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. 4s Camera Trajectory */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                5. 4-Second Camera Movement
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FASHION_CAMERA_OPTIONS.map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => handleCameraChange(cam)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedCamera.id === cam.id
                        ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/50'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-medium text-xs text-slate-200">{cam.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{cam.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. High-Fashion Runway Lighting */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                6. Lighting Atmosphere
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FASHION_LIGHTING_OPTIONS.map((light) => (
                  <button
                    key={light.id}
                    onClick={() => handleLightingChange(light)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedLighting.id === light.id
                        ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/50'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-medium text-xs text-slate-200">{light.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{light.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Aspect Ratio, Quality & STRICT 4s Duration Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Aspect Ratio - Defaults to 9:16 */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-rose-400" />
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {FASHION_ASPECT_RATIO_OPTIONS.map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => setSelectedRatio(ratio)}
                      className={`px-2 py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                        selectedRatio.id === ratio.id
                          ? 'border-rose-500 bg-rose-500/15 text-white font-bold text-xs'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 text-xs hover:border-slate-700'
                      }`}
                    >
                      {ratio.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Preset */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  Quality
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {FASHION_QUALITY_OPTIONS.map((qual) => (
                    <button
                      key={qual.id}
                      onClick={() => setSelectedQuality(qual)}
                      className={`px-1 py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                        selectedQuality.id === qual.id
                          ? 'border-indigo-500 bg-indigo-500/15 text-white font-bold text-xs'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 text-xs hover:border-slate-700'
                      }`}
                    >
                      {qual.id.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* IMMUTABLE 4-Second Duration Lock */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  Duration
                </label>
                <div className="px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-950/30 text-rose-200 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold tracking-wider">{FASHION_VIDEO_DURATION}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400/90 bg-rose-500/20 px-1.5 py-0.5 rounded">
                    LOCKED 4s
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Reference Upload */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                  Optional Motion/Fabric Reference (Clip)
                </label>
                {referenceAsset && (
                  <button 
                    onClick={() => setReferenceAsset(null)}
                    className="text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                  >
                    Clear Reference
                  </button>
                )}
              </div>
              <button
                onClick={handleSimulateUploadReference}
                className={`w-full p-3 rounded-xl border border-dashed text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  referenceAsset
                    ? 'border-rose-500/50 bg-rose-500/10 text-rose-300'
                    : 'border-slate-700 bg-slate-800/20 text-slate-400 hover:border-slate-600 hover:bg-slate-800/40'
                }`}
              >
                {referenceAsset ? (
                  <>
                    <FileCheck className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-medium">Attached: {referenceAsset}</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-slate-400" />
                    <span className="text-xs">Click to attach reference catwalk motion or garment sketch</span>
                  </>
                )}
              </button>
            </div>

            {/* Prompt Editor */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  Synthesized Fashion Prompt
                </label>
                <div className="flex items-center gap-2">
                  {isManualEdit && (
                    <button
                      onClick={() => syncPrompt()}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset Directives
                    </button>
                  )}
                  <button
                    onClick={handleCopyPrompt}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedPrompt ? 'Copied' : 'Copy Prompt'}
                  </button>
                </div>
              </div>
              <textarea
                value={promptText}
                onChange={(e) => {
                  setPromptText(e.target.value);
                  setIsManualEdit(true);
                }}
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-none leading-relaxed"
                placeholder="Fashion video generation prompt..."
              />
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>Variables automatically updated from garment, model cadence, runway stage, and lighting.</span>
              </p>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                isGenerating
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 shadow-rose-600/30 hover:shadow-rose-600/50 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-rose-400" />
                  Generating 4s Fashion Reel...
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" />
                  Generate 4-Second Fashion Video
                </>
              )}
            </button>
          </div>

          {/* Right Column: Video Reel Canvas & Timeline Preview */}
          <div className="lg:col-span-5 p-6 bg-slate-950/60 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Active Catwalk Canvas
                  </span>
                </div>
                {generatedVideo && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    Seed: #{generatedVideo.seed} • 0:04 60p
                  </span>
                )}
              </div>

              {/* Video Player Canvas Container */}
              <div className="relative w-full aspect-[9/16] max-h-[460px] mx-auto rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center group shadow-2xl">
                {isGenerating ? (
                  // Generating State with Progress Stages
                  <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center space-y-4 bg-slate-900/90 backdrop-blur-sm">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-rose-500/20 animate-ping" />
                      <div className="w-14 h-14 rounded-full border-4 border-rose-500 border-t-transparent animate-spin flex items-center justify-center">
                        <Film className="w-6 h-6 text-rose-400 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1.5 max-w-xs">
                      <h4 className="text-sm font-semibold text-white">Synthesizing Catwalk Reel</h4>
                      <p className="text-xs text-rose-300 animate-pulse">{genStage}</p>
                    </div>
                    {/* Progress bar */}
                    <div className="w-48 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-rose-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${genProgress}%` }}
                      />
                    </div>
                  </div>
                ) : error ? (
                  // Error State
                  <div className="p-6 text-center space-y-3 max-w-sm">
                    <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
                    <h4 className="text-sm font-semibold text-rose-200">Reel Synthesis Failed</h4>
                    <p className="text-xs text-slate-400">{error}</p>
                    <button
                      onClick={() => handleGenerate()}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 transition-colors cursor-pointer"
                    >
                      Retry Generation
                    </button>
                  </div>
                ) : generatedVideo ? (
                  // Render Generated Animated Video Graphic
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={generatedVideo.videoGraphicUrl} 
                      alt={generatedVideo.prompt}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-85'}`}
                    />

                    {/* Catwalk 4-Second Reel HUD Overlay */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/10 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        0:04 REEL
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-rose-300 border border-white/10">
                        {generatedVideo.resolution}
                      </span>
                    </div>

                    {/* Bottom Playback Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 text-rose-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
                      </button>
                      
                      {/* 4s Micro-timeline scrubber animation */}
                      <div className="flex-1 mx-3 h-1 bg-white/20 rounded-full overflow-hidden relative">
                        <div 
                          className={`h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full ${
                            isPlaying ? 'w-full animate-[progress_4s_linear_infinite]' : 'w-1/2'
                          }`}
                        />
                      </div>

                      <span className="text-[10px] font-mono text-slate-300">0:04</span>
                    </div>
                  </div>
                ) : (
                  // Initial Idle Placeholder
                  <div className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                      <Film className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300">No Video Generated Yet</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                        Select garment, model presentation, and click Generate to start the 4s reel.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Metadata Inspector */}
              {generatedVideo && (
                <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-1 text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Trajectory:</span>
                    <span className="text-rose-300 truncate max-w-[180px]">{generatedVideo.meta.motionTrajectory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Model Cadence:</span>
                    <span className="text-slate-200">{selectedModel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Engine / Codec:</span>
                    <span className="text-slate-200">{generatedVideo.meta.codec}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Render Latency:</span>
                    <span className="text-emerald-400">{generatedVideo.latencyMs}ms</span>
                  </div>
                </div>
              )}
            </div>

            {/* Post-Generation Action Bar */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={handleRegenerate}
                disabled={!generatedVideo || isGenerating}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>

              <button
                onClick={handleCreateVariation}
                disabled={!generatedVideo || isGenerating}
                className="flex-1 py-2.5 px-3 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Variation
              </button>

              <button
                onClick={handleSaveToRecent}
                disabled={!generatedVideo || isGenerating}
                className={`py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer ${
                  savedSuccess
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                {savedSuccess ? 'Saved!' : 'Save Asset'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
