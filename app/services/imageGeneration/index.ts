import { ImageGenerationProvider, ImageGenerationRequest, ImageGenerationResponse } from './types';
import { MockImageGenerationProvider } from './mockProvider';

export * from './types';
export * from './mockProvider';
export * from './externalProvider';

class ImageGenerationService {
  private activeProvider: ImageGenerationProvider;

  constructor(defaultProvider?: ImageGenerationProvider) {
    this.activeProvider = defaultProvider ?? new MockImageGenerationProvider();
  }

  /**
   * Set or swap the underlying generation provider (e.g. OpenAI DALL-E, Replicate, Fal.ai)
   */
  setProvider(provider: ImageGenerationProvider) {
    this.activeProvider = provider;
  }

  getProvider(): ImageGenerationProvider {
    return this.activeProvider;
  }

  /**
   * Unified generation entrypoint used by the UI
   */
  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      return await this.activeProvider.generate(request);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown generation pipeline error';
      console.error(`[ImageGenerationService] Error in ${this.activeProvider.name}:`, errorMessage);
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance ready for use across application components
export const imageGenerationService = new ImageGenerationService();
