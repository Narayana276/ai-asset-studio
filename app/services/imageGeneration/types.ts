export type ImageWorkflowType = 'product-image' | 'lifestyle-image';

export interface ImageGenerationRequest {
  workflowType?: ImageWorkflowType;
  productId: string;
  productName: string;
  styleId: string;
  styleName: string;
  backgroundId?: string;
  backgroundName?: string;
  environmentId?: string;
  environmentName?: string;
  cameraCompositionId?: string;
  cameraCompositionName?: string;
  lightingId: string;
  lightingName: string;
  aspectRatioId: string;
  resolution: string;
  prompt: string;
  seed?: number;
  variationIndex?: number;
}

export interface ImageGenerationResponse {
  id: string;
  imageUrl: string; // Base64 or SVG Data URI
  seed: number;
  prompt: string;
  aspectRatio: string;
  resolution: string;
  productName: string;
  styleName: string;
  backgroundName: string;
  lightingName: string;
  createdAt: string;
  latencyMs: number;
  variationIndex: number;
  meta: {
    cameraAngle: string;
    lightingHue: string;
    accentColor: string;
    surfaceTexture: string;
    renderEngine: string;
  };
}

/**
 * Provider interface: Can be implemented by MockProvider, OpenAIProvider,
 * ReplicateProvider, FalAiProvider, or internal custom GPU endpoints.
 */
export interface ImageGenerationProvider {
  readonly id: string;
  readonly name: string;
  generate(request: ImageGenerationRequest): Promise<ImageGenerationResponse>;
}
