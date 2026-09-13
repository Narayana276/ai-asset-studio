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
        ? 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&q=80&w=800'
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=800' 
        : 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'; 
    case 'sneakers':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' 
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800' 
        : 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800'; 
    case 'handbag':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800' 
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800' 
        : 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800'; 
    case 'sunglasses':
    default:
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800' 
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800' 
        : 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=800'; 
  }
}

function generateProceduralFashionVideoGraphic(params: SvgVideoParams): string {
  const { productId, seed, variationIndex } = params;
  const variation = (seed + variationIndex) % 3;

  switch (productId) {
    case 'jacket':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=800'
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1560457099-64cb8a5eb503?auto=format&fit=crop&q=80&w=800' 
        : 'https://images.unsplash.com/photo-1509631179647-0c739a4f6cf6?auto=format&fit=crop&q=80&w=800'; 
    case 'sneakers':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&q=80&w=800' 
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&q=80&w=800' 
        : 'https://images.unsplash.com/photo-1509631179647-0c739a4f6cf6?auto=format&fit=crop&q=80&w=800'; 
    case 'handbag':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=800' 
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1509631179647-0c739a4f6cf6?auto=format&fit=crop&q=80&w=800' 
        : 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=800'; 
    case 'sunglasses':
    default:
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&q=80&w=800' 
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=800' 
        : 'https://images.unsplash.com/photo-1509631179647-0c739a4f6cf6?auto=format&fit=crop&q=80&w=800'; 
  }
}
