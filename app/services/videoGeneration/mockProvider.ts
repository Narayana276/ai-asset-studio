import { VideoGenerationProvider, VideoGenerationRequest, VideoGenerationResponse } from './types';

export class MockVideoGenerationProvider implements VideoGenerationProvider {
  readonly id = 'mock-video-engine';
  readonly name = 'Internal Video Synthesis Engine v1.2';

  async generate(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new Error('Prompt directives cannot be empty. Please enter a generation prompt.');
    }

    const latency = request.qualityId === '4k' ? 2400 + Math.floor(Math.random() * 800) : 1800 + Math.floor(Math.random() * 600);
    await new Promise((resolve) => setTimeout(resolve, latency));

    if (request.prompt.toLowerCase().includes('[error]') || request.prompt.toLowerCase().includes('[fail]')) {
      throw new Error('Synthetic generation cluster timed out during frame interpolation. Please retry.');
    }

    const seed = request.seed ?? Math.floor(10000000 + Math.random() * 90000000);
    const variationIndex = request.variationIndex ?? 0;
    
    const isFashion = request.workflowType === 'fashion-video';
    
    const videoUrl = isFashion
      ? generateProceduralFashionVideoGraphic({ ...request, seed, variationIndex })
      : generateProceduralVideoGraphic({ ...request, seed, variationIndex });

    const motionPaths = [
      '360° Orbital Pan',
      'Slow Push-In Dolly',
      'Dynamic Tracking Sweep',
      'Subtle Breathing Float'
    ];
    const motionTrajectory = request.cameraMovementName || motionPaths[(variationIndex + (seed % motionPaths.length)) % motionPaths.length];

    return {
      id: `vid-${seed.toString().slice(0, 6)}`,
      videoGraphicUrl: videoUrl,
      seed,
      duration: '0:04',
      fps: 60,
      qualityName: request.qualityName,
      cameraMovementName: request.cameraMovementName,
      prompt: request.prompt,
      aspectRatio: request.aspectRatioId,
      resolution: request.resolution,
      productName: request.productName,
      styleName: request.styleName,
      backgroundName: request.backgroundName || 'Studio Environment',
      lightingName: request.lightingName,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      latencyMs: latency,
      variationIndex,
      meta: {
        motionTrajectory,
        lightingModel: request.lightingName,
        renderEngine: this.name,
        isLooping: true,
        codec: request.qualityId === '4k' ? 'Apple ProRes 422 HQ' : 'H.265 High-Profile 60fps',
      },
    };
  }
}

interface SvgVideoParams extends VideoGenerationRequest {
  seed: number;
  variationIndex: number;
}

function generateProceduralVideoGraphic(params: SvgVideoParams): string {
  const { productId, seed, variationIndex } = params;
  const variation = (seed + variationIndex) % 3;

  switch (productId) {
    case 'jacket':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1553640662-9ab20b8fa2ea?auto=format&fit=crop&q=80&w=800'
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1485742217969-f1e4cd444fe8?auto=format&fit=crop&q=80&w=800'
        : 'https://images.unsplash.com/photo-1602700205182-923ff4b8e643?auto=format&fit=crop&q=80&w=800';
    case 'sneakers':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1665168920013-4b5a1ed81b6e?auto=format&fit=crop&q=80&w=800'
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1636450853539-e13e738b9841?auto=format&fit=crop&q=80&w=800'
        : 'https://images.unsplash.com/photo-1659401580417-854930bf8b97?auto=format&fit=crop&q=80&w=800';
    case 'handbag':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1547563494-44d4293c053d?auto=format&fit=crop&q=80&w=800'
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1616702931689-4e628d368035?auto=format&fit=crop&q=80&w=800'
        : 'https://images.unsplash.com/photo-1616729268904-281edc83a670?auto=format&fit=crop&q=80&w=800';
    case 'sunglasses':
    default:
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1614468501073-4b5bff384516?auto=format&fit=crop&q=80&w=800'
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1583854197400-3cde1621f3b7?auto=format&fit=crop&q=80&w=800'
        : 'https://images.unsplash.com/photo-1547564151-76c644a30770?auto=format&fit=crop&q=80&w=800';
  }
}

function generateProceduralFashionVideoGraphic(params: SvgVideoParams): string {
  const { productId, seed, variationIndex } = params;
  const variation = (seed + variationIndex) % 3;

  switch (productId) {
    case 'jacket':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1553640662-9ab20b8fa2ea?auto=format&fit=crop&q=80&w=800'
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1485742217969-f1e4cd444fe8?auto=format&fit=crop&q=80&w=800'
        : 'https://images.unsplash.com/photo-1602700205182-923ff4b8e643?auto=format&fit=crop&q=80&w=800';
    case 'sneakers':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1665168920013-4b5a1ed81b6e?auto=format&fit=crop&q=80&w=800'
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1636450853539-e13e738b9841?auto=format&fit=crop&q=80&w=800'
        : 'https://images.unsplash.com/photo-1659401580417-854930bf8b97?auto=format&fit=crop&q=80&w=800';
    case 'handbag':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1547563494-44d4293c053d?auto=format&fit=crop&q=80&w=800'
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1616702931689-4e628d368035?auto=format&fit=crop&q=80&w=800'
        : 'https://images.unsplash.com/photo-1616729268904-281edc83a670?auto=format&fit=crop&q=80&w=800';
    case 'sunglasses':
    default:
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1614468501073-4b5bff384516?auto=format&fit=crop&q=80&w=800'
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1583854197400-3cde1621f3b7?auto=format&fit=crop&q=80&w=800'
        : 'https://images.unsplash.com/photo-1547564151-76c644a30770?auto=format&fit=crop&q=80&w=800';
  }
}
