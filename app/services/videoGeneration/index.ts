import { VideoGenerationProvider, VideoGenerationRequest, VideoGenerationResponse } from './types';
import { MockVideoGenerationProvider } from './mockProvider';

export * from './types';
export * from './mockProvider';
export * from './externalProvider';

class VideoGenerationService {
  private activeProvider: VideoGenerationProvider;

  constructor(defaultProvider?: VideoGenerationProvider) {
    this.activeProvider = defaultProvider ?? new MockVideoGenerationProvider();
  }

  /**
   * Set or swap the underlying generation provider (e.g. Runway Gen-3, Luma Dream Machine, Sora, CogVideoX)
   */
  setProvider(provider: VideoGenerationProvider) {
    this.activeProvider = provider;
  }

  getProvider(): VideoGenerationProvider {
    return this.activeProvider;
  }

  /**
   * Unified video generation entrypoint used by the UI
   */
  async generate(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    try {
      return await this.activeProvider.generate(request);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown video generation pipeline error';
      console.error(`[VideoGenerationService] Error in ${this.activeProvider.name}:`, errorMessage);
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance ready for use across application components
export const videoGenerationService = new VideoGenerationService();
