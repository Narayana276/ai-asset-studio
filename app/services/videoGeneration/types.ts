export interface VideoGenerationRequest {
  workflowType?: 'product-video' | 'fashion-video';
  productId: string;
  productName: string;
  styleId: string;
  styleName: string;
  cameraMovementId: string;
  cameraMovementName: string;
  backgroundId: string;
  backgroundName: string;
  lightingId: string;
  lightingName: string;
  aspectRatioId: string;
  resolution: string;
  qualityId: string;
  qualityName: string;
  prompt: string;
  modelId?: string;
  modelName?: string;
  referenceAssetName?: string;
  seed?: number;
  variationIndex?: number;
}

export interface VideoGenerationResponse {
  id: string;
  seed: number;
  duration: string; // e.g. "0:04" or "0:06"
  fps: number; // 60
  resolution: string;
  aspectRatio: string;
  videoGraphicUrl: string; // Dynamic animated SVG motion graphic data URI
  productName: string;
  styleName: string;
  cameraMovementName: string;
  backgroundName: string;
  lightingName: string;
  qualityName: string;
  prompt: string;
  createdAt: string;
  latencyMs: number;
  variationIndex: number;
  meta: {
    motionTrajectory: string;
    lightingModel: string;
    renderEngine: string;
    isLooping: boolean;
    codec: string;
  };
}

export interface VideoGenerationProvider {
  readonly id: string;
  readonly name: string;
  generate(request: VideoGenerationRequest): Promise<VideoGenerationResponse>;
}
