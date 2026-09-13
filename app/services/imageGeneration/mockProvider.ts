import { ImageGenerationProvider, ImageGenerationRequest, ImageGenerationResponse } from './types';

export class MockImageGenerationProvider implements ImageGenerationProvider {
  readonly id = 'mock-studio-engine';
  readonly name = 'Internal Studio Neural Mock Engine v2.4';

  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    // Validate request
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new Error('Prompt directives cannot be empty. Please enter or reset the generation prompt.');
    }

    // Realistic generation latency simulation (1.2s - 1.8s)
    const latency = 1200 + Math.floor(Math.random() * 600);
    await new Promise((resolve) => setTimeout(resolve, latency));

    // Optional error simulation hook if prompt contains "[fail]"
    if (request.prompt.toLowerCase().includes('[error]') || request.prompt.toLowerCase().includes('[fail]')) {
      throw new Error('Synthetic generation cluster timed out while allocating GPU memory node. Please retry.');
    }

    const seed = request.seed ?? Math.floor(10000000 + Math.random() * 90000000);
    const variationIndex = request.variationIndex ?? 0;

    const isLifestyle = request.workflowType === 'lifestyle-image';

    // Build unique deterministic visual SVG based on product, style, background/environment, lighting, seed, and variation
    const svgDataUrl = isLifestyle
      ? generateProceduralLifestyleSvg({
          ...request,
          seed,
          variationIndex,
        })
      : generateProceduralProductSvg({
          ...request,
          seed,
          variationIndex,
        });

    const cameraAngles = [
      'Hero 3/4 Studio View',
      'Dynamic Low-Angle Hero Tilt',
      'Elevated 45° Editorial Flatlay',
      'Direct Frontal Packshot Alignment',
      'Macro Profile Rim Focus',
    ];
    const cameraAngle = request.cameraCompositionName || cameraAngles[(variationIndex + (seed % cameraAngles.length)) % cameraAngles.length];

    const lightingHues = {
      'softbox-rim': '5600K Diffuse Studio Daylight',
      'chiaroscuro': '3400K Single Spot Key Slash',
      'golden-hour': '3200K Warm Sunset Glare',
      'golden-hour-window': '3200K Warm Sunset Window Stream',
      'clean-ecommerce': '5200K Flat Balanced Daylight',
      'caustic-specular': 'Prismatic Refractive Caustics',
      'overcast-diffused': '5800K Soft Overcast Ambient',
      'twilight-ambient': 'Deep Twilight & 2700K Lamp Glow',
      'dappled-sunbeams': 'Dappled Sunlight Leaf Shadows',
      'bright-morning': '5400K Crisp High-Key Sun',
    };

    return {
      id: `ast-${seed.toString().slice(0, 6)}`,
      imageUrl: svgDataUrl,
      seed,
      prompt: request.prompt,
      aspectRatio: request.aspectRatioId,
      resolution: request.resolution,
      productName: request.productName,
      styleName: request.styleName,
      backgroundName: isLifestyle ? (request.environmentName || 'Architectural Environment') : (request.backgroundName || 'Studio Surface'),
      lightingName: request.lightingName,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      latencyMs: latency,
      variationIndex,
      meta: {
        cameraAngle,
        lightingHue: lightingHues[request.lightingId as keyof typeof lightingHues] || 'Neutral Daylight',
        accentColor: getAccentColorForStyle(request.styleId, seed),
        surfaceTexture: isLifestyle ? (request.environmentName || 'Interior Room') : (request.backgroundName || 'Studio Surface'),
        renderEngine: this.name,
      },
    };
  }
}

function getAccentColorForStyle(styleId: string, seed: number): string {
  switch (styleId) {
    case 'cyberpunk':
      return seed % 2 === 0 ? '#06b6d4' : '#ec4899';
    case 'botanical':
      return '#10b981';
    case 'editorial':
      return '#d97706';
    case 'minimalist':
      return '#a78bfa';
    case 'commercial':
    default:
      return '#3b82f6';
  }
}

interface SvgGenParams extends ImageGenerationRequest {
  seed: number;
  variationIndex: number;
}

function generateProceduralProductSvg(params: SvgGenParams): string {
  const { productId, seed, variationIndex } = params;
  const variation = (seed + variationIndex) % 3;

  switch (productId) {
    case 'jacket':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&q=80&w=800' // Leather jacket on hanger
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=800' 
        : 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'; 
    case 'sneakers':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' // Red Nike
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800' // Vans
        : 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800'; // Sneakers product
    case 'handbag':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800' 
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800' // White bag
        : 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800'; 
    case 'sunglasses':
    default:
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800' 
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800' // Sunglasses on sand
        : 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=800'; 
  }
}

function renderProductGraphic(productId: string, seed: number, styleId: string): string {
  const accent = getAccentColorForStyle(styleId, seed);

  switch (productId) {
    case 'jacket':
      return `
        <!-- Black Leather Jacket -->
        <g id="jacket-graphic">
          <!-- Main Body -->
          <rect x="220" y="180" width="160" height="260" rx="20" fill="#1e293b"/>
          <!-- Left Sleeve -->
          <path d="M220,180 L180,300 L180,460 L260,460" fill="#0f172a"/>
          <!-- Right Sleeve -->
          <path d="M380,180 L420,300 L420,460 L340,460" fill="#0f172a"/>
          <!-- Front Zipper -->
          <line x1="300" y1="180" x2="300" y2="440" stroke="#e2e8f0" stroke-width="3"/>
        </g>
      `;

    case 'watch':
      return `
        <!-- Stylish Sunglasses -->
        <g id="sunglasses-graphic">
          <!-- Frame -->
          <rect x="210" y="260" width="180" height="80" rx="20" fill="#1e293b"/>
          <!-- Left Lens -->
          <circle cx="260" cy="300" r="30" fill="#0f172a"/>
          <!-- Right Lens -->
          <circle cx="340" cy="300" r="30" fill="#0f172a"/>
          <!-- Bridge -->
          <rect x="300" y="285" width="20" height="30" fill="#0f172a"/>
        </g>
      `;

    case 'headphones':
      return `
        <!-- Stylish Sunglasses -->
        <g id="sunglasses-graphic">
          <!-- Frame -->
          <rect x="210" y="260" width="180" height="80" rx="20" fill="#1e293b"/>
          <!-- Left Lens -->
          <circle cx="260" cy="300" r="30" fill="#0f172a"/>
          <!-- Right Lens -->
          <circle cx="340" cy="300" r="30" fill="#0f172a"/>
          <!-- Bridge -->
          <rect x="300" y="285" width="20" height="30" fill="#0f172a"/>
        </g>
      `;

    case 'sneakers':
      return `
        <!-- Performance Running Sneaker -->
        <g id="sneaker-graphic">
          <!-- Aerodynamic Sole Foam -->
          <path d="M160,390 C180,410 240,420 330,420 C410,420 460,405 480,380 C440,395 380,390 320,385 C240,380 180,380 160,390 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5"/>
          <!-- Cushion Pod Pod Accent -->
          <ellipse cx="240" cy="405" rx="30" ry="8" fill="${accent}"/>
          <ellipse cx="320" cy="405" rx="26" ry="7" fill="${accent}"/>
          <!-- Shoe Body Upper -->
          <path d="M165,385 C175,340 230,320 280,300 C320,270 360,260 395,290 C420,310 450,335 475,375 C450,385 410,385 360,380 C270,370 200,380 165,385 Z" fill="#0f172a" stroke="#475569" stroke-width="2"/>
          <!-- Dynamic Swoosh / Stripe -->
          <path d="M240,355 Q330,335 410,320 Q350,360 260,370 Z" fill="${accent}" opacity="0.9"/>
          <!-- Laces & Tongue -->
          <path d="M310,295 L340,320 M320,285 L350,310 M330,275 L360,300" stroke="#e2e8f0" stroke-width="2.8" stroke-linecap="round"/>
          <!-- Heel Collar -->
          <circle cx="395" cy="285" r="16" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
        </g>
      `;

    case 'serum':
      return `
        <!-- Luxury Leather Handbag -->
        <g id="handbag-graphic">
          <!-- Main Body -->
          <rect x="200" y="180" width="200" height="250" rx="20" fill="#1e293b"/>
          <!-- Flap -->
          <path d="M200,180 L400,180 L380,240 L220,240 Z" fill="#0f172a"/>
          <!-- Handle -->
          <rect x="260" y="150" width="80" height="30" rx="5" fill="#0f172a"/>
          <!-- Stitching -->
          <path d="M210,210 L390,210" stroke="#e2e8f0" stroke-width="2"/>
        </g>
      `;

    case 'tumbler':
    default:
      return `
        <!-- Matte Ceramic Tumbler -->
        <g id="tumbler-graphic">
          <!-- Tumbler Body -->
          <path d="M245,190 L355,190 L335,430 L265,430 Z" fill="#334155" stroke="#cbd5e1" stroke-width="2.5"/>
          <!-- Silicone Grip Band -->
          <path d="M249,270 L351,270 L345,340 L255,340 Z" fill="${accent}" opacity="0.85"/>
          <!-- Minimalist Logo -->
          <circle cx="300" cy="305" r="14" fill="#0f172a"/>
          <path d="M294,305 L306,305 M300,299 L300,311" stroke="#ffffff" stroke-width="2"/>
          <!-- Lid Assembly -->
          <ellipse cx="300" cy="190" rx="58" ry="14" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
          <!-- Sipping Spout Tab -->
          <rect x="288" y="170" width="24" height="12" rx="3" fill="${accent}"/>
          <!-- Ceramic Body Highlight -->
          <path d="M260,205 L275,415" stroke="#ffffff" stroke-width="4" opacity="0.35" stroke-linecap="round"/>
        </g>
      `;
  }
}

function generateProceduralLifestyleSvg(params: SvgGenParams): string {
  const { productId, seed, variationIndex } = params;
  const variation = (seed + variationIndex) % 3;
  
  switch (productId) {
    case 'jacket':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=800' // Guy in leather jacket
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800' // Woman in leather jacket
        : 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800';
    case 'sneakers':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=800' // Guy tying sneakers
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800' // Vans on feet
        : 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?auto=format&fit=crop&q=80&w=800'; // Person walking in sneakers
    case 'handbag':
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800' // Woman with purse
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800' // Woman carrying bag
        : 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800'; // Handbag fashion street
    case 'sunglasses':
    default:
      return variation === 0 
        ? 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=800' // Woman in sunglasses
        : variation === 1 
        ? 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800' // Guy in sunglasses
        : 'https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&q=80&w=800'; // Runway model in sunglasses
  }
}
