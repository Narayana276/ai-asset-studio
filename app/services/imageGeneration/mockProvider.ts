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
  const { productId, styleId, backgroundId, lightingId, seed, variationIndex } = params;

  // Derive deterministic parameters from seed
  const rotationDegrees = ((seed % 19) - 9) + (variationIndex * 5);
  const scalePercent = 94 + (seed % 12);
  const lightOffset = 20 + (seed % 60);

  // Background gradient setup
  let bgFill = '';
  let floorShadowColor = 'rgba(0,0,0,0.4)';

  switch (backgroundId) {
    case 'pure-white':
      bgFill = `
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="65%" stop-color="#f8fafc"/>
            <stop offset="100%" stop-color="#e2e8f0"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#bgGrad)"/>
      `;
      floorShadowColor = 'rgba(15, 23, 42, 0.18)';
      break;

    case 'carrara-marble':
      bgFill = `
        <defs>
          <linearGradient id="bgGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stop-color="#f1f5f9"/>
            <stop offset="50%" stop-color="#e2e8f0"/>
            <stop offset="100%" stop-color="#cbd5e1"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#bgGrad)"/>
        <!-- Marble veins -->
        <path d="M-50,120 Q180,240 320,180 T650,260" stroke="#94a3b8" stroke-width="1.8" opacity="0.35" fill="none"/>
        <path d="M-20,380 Q220,320 420,440 T650,390" stroke="#64748b" stroke-width="1.2" opacity="0.3" fill="none"/>
        <path d="M120,-30 Q280,180 220,380 T380,630" stroke="#94a3b8" stroke-width="0.8" opacity="0.25" fill="none"/>
      `;
      floorShadowColor = 'rgba(51, 65, 85, 0.35)';
      break;

    case 'obsidian-slate':
      bgFill = `
        <defs>
          <linearGradient id="bgGrad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="60%" stop-color="#090d16"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#bgGrad)"/>
        <!-- Slate texture lines -->
        <line x1="0" y1="420" x2="600" y2="420" stroke="#1e293b" stroke-width="2" opacity="0.6"/>
        <line x1="0" y1="460" x2="600" y2="460" stroke="#334155" stroke-width="1" opacity="0.4"/>
      `;
      floorShadowColor = 'rgba(0, 0, 0, 0.85)';
      break;

    case 'warm-beige':
      bgFill = `
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef3c7"/>
            <stop offset="50%" stop-color="#fde68a"/>
            <stop offset="100%" stop-color="#d97706" stop-opacity="0.5"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#bgGrad)"/>
        <!-- Travertine architectural arch -->
        <path d="M120,600 V220 A180,180 0 0,1 480,220 V600" fill="#fef08a" opacity="0.45"/>
        <path d="M170,600 V240 A130,130 0 0,1 430,240 V600" fill="#fef3c7" opacity="0.6"/>
      `;
      floorShadowColor = 'rgba(120, 53, 15, 0.35)';
      break;

    case 'alpha-transparent':
    default:
      bgFill = `
        <defs>
          <pattern id="checkers" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#1e293b"/>
            <rect x="10" width="10" height="10" fill="#0f172a"/>
            <rect y="10" width="10" height="10" fill="#0f172a"/>
            <rect x="10" y="10" width="10" height="10" fill="#1e293b"/>
          </pattern>
        </defs>
        <rect width="600" height="600" fill="url(#checkers)"/>
      `;
      floorShadowColor = 'rgba(0, 0, 0, 0.7)';
      break;
  }

  // Lighting overlay
  let lightingOverlay = '';
  switch (lightingId) {
    case 'chiaroscuro':
      lightingOverlay = `
        <defs>
          <linearGradient id="chiaroLight" x1="${lightOffset}%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.38"/>
            <stop offset="45%" stop-color="#ffffff" stop-opacity="0.05"/>
            <stop offset="70%" stop-color="#000000" stop-opacity="0.75"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#chiaroLight)" pointer-events="none"/>
      `;
      break;

    case 'golden-hour':
      lightingOverlay = `
        <defs>
          <radialGradient id="sunFlare" cx="85%" cy="15%" r="70%">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.55"/>
            <stop offset="35%" stop-color="#d97706" stop-opacity="0.3"/>
            <stop offset="75%" stop-color="#b45309" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="600" height="600" fill="url(#sunFlare)" pointer-events="none"/>
      `;
      break;

    case 'caustic-specular':
      lightingOverlay = `
        <defs>
          <linearGradient id="causticGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="10%" stop-color="#38bdf8" stop-opacity="0.25"/>
            <stop offset="35%" stop-color="#ec4899" stop-opacity="0.2"/>
            <stop offset="60%" stop-color="#facc15" stop-opacity="0.2"/>
            <stop offset="85%" stop-color="#34d399" stop-opacity="0.25"/>
          </linearGradient>
        </defs>
        <path d="M-50,200 Q200,450 350,220 T650,420" stroke="url(#causticGrad)" stroke-width="45" opacity="0.35" fill="none" filter="blur(12px)"/>
      `;
      break;

    case 'softbox-rim':
    case 'clean-ecommerce':
    default:
      lightingOverlay = `
        <defs>
          <linearGradient id="softboxGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
            <stop offset="30%" stop-color="#ffffff" stop-opacity="0"/>
            <stop offset="70%" stop-color="#ffffff" stop-opacity="0"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0.22"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#softboxGrad)" pointer-events="none"/>
      `;
      break;
  }

  // Style accents & neon glow for cyberpunk
  let styleAccent = '';
  if (styleId === 'cyberpunk') {
    styleAccent = `
      <defs>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="150" cy="180" r="160" stroke="#06b6d4" stroke-width="1.5" fill="none" opacity="0.4" filter="url(#neonGlow)"/>
      <path d="M400,100 L550,250" stroke="#ec4899" stroke-width="2" opacity="0.5" filter="url(#neonGlow)"/>
    `;
  } else if (styleId === 'botanical') {
    styleAccent = `
      <!-- Soft foliage silhouette in background -->
      <g opacity="0.18" fill="#047857">
        <path d="M500,480 C480,400 420,380 430,320 C470,330 520,380 540,460 Z"/>
        <path d="M520,440 C540,360 600,340 590,290 C550,310 520,360 500,430 Z"/>
        <path d="M80,480 C100,410 160,390 150,330 C120,340 80,390 60,470 Z"/>
      </g>
    `;
  }

  // Pedestal & Contact Shadow
  const pedestalSvg = `
    <!-- Contact Shadow -->
    <ellipse cx="300" cy="465" rx="145" ry="18" fill="${floorShadowColor}" filter="blur(6px)"/>
    <ellipse cx="300" cy="462" rx="110" ry="12" fill="${floorShadowColor}"/>

    <!-- Pedestal Base -->
    <g transform="translate(180, 440)">
      <path d="M0,20 L240,20 L220,55 L20,55 Z" fill="#0f172a" opacity="0.45"/>
      <ellipse cx="120" cy="20" rx="120" ry="14" fill="#1e293b" stroke="#475569" stroke-width="1.2"/>
    </g>
  `;

  // Dynamic Product Vector Rendering
  const productSvg = renderProductGraphic(productId, seed, styleId);

  // Assemble full SVG document
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
      ${bgFill}
      ${styleAccent}
      ${pedestalSvg}

      <!-- Main Product Centered with Dynamic Seed Rotation -->
      <g transform="translate(300, 310) scale(${scalePercent / 100}) rotate(${rotationDegrees}) translate(-300, -310)">
        ${productSvg}
      </g>

      ${lightingOverlay}

      <!-- Studio Vignette & Frame Overlay -->
      <rect width="600" height="600" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
    </svg>
  `;

  // Encode as clean UTF-8 Data URI
  const encoded = encodeURIComponent(svgContent.trim())
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

function renderProductGraphic(productId: string, seed: number, styleId: string): string {
  const accent = getAccentColorForStyle(styleId, seed);

  switch (productId) {
    case 'perfume':
      return `
        <!-- Glass Perfume Bottle -->
        <g id="perfume-bottle">
          <!-- Bottle Body -->
          <rect x="235" y="240" width="130" height="190" rx="16" fill="#1e293b" fill-opacity="0.85" stroke="#e2e8f0" stroke-width="3"/>
          <!-- Perfume Liquid Meniscus -->
          <rect x="242" y="275" width="116" height="148" rx="10" fill="#f59e0b" fill-opacity="0.55"/>
          <!-- Internal Tube -->
          <line x1="300" y1="230" x2="300" y2="420" stroke="#fef3c7" stroke-width="3" stroke-linecap="round" opacity="0.75"/>
          <!-- Golden Neck Ring -->
          <rect x="272" y="215" width="56" height="25" rx="4" fill="#d97706" stroke="#fbbf24" stroke-width="2"/>
          <!-- Atomizer Cap -->
          <rect x="265" y="150" width="70" height="65" rx="8" fill="#1e293b" stroke="#cbd5e1" stroke-width="2.5"/>
          <!-- Glass Reflections & Specular Highlights -->
          <path d="M246,252 L246,418" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
          <path d="M256,252 L256,418" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.35"/>
          <!-- Brand Label Placard -->
          <rect x="255" y="325" width="90" height="50" rx="4" fill="#0f172a" stroke="${accent}" stroke-width="1.5"/>
          <text x="300" y="348" text-anchor="middle" fill="#f8fafc" font-size="10" font-weight="bold" font-family="sans-serif">EAU DE PARFUM</text>
          <text x="300" y="362" text-anchor="middle" fill="#94a3b8" font-size="8" font-family="sans-serif">ATELIER STUDIO</text>
        </g>
      `;

    case 'watch':
      return `
        <!-- Luxury Ceramic Watch -->
        <g id="watch-graphic">
          <!-- Strap Top & Bottom -->
          <path d="M255,80 L345,80 L340,210 L260,210 Z" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <path d="M260,410 L340,410 L345,540 L255,540 Z" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <!-- Ceramic Case -->
          <circle cx="300" cy="310" r="115" fill="#090d16" stroke="#475569" stroke-width="5"/>
          <!-- Bezel -->
          <circle cx="300" cy="310" r="100" fill="#0f172a" stroke="#94a3b8" stroke-width="3"/>
          <!-- Bezel Markers -->
          <circle cx="300" cy="216" r="3.5" fill="#38bdf8"/>
          <circle cx="394" cy="310" r="3.5" fill="#e2e8f0"/>
          <circle cx="300" cy="404" r="3.5" fill="#e2e8f0"/>
          <circle cx="206" cy="310" r="3.5" fill="#e2e8f0"/>
          <!-- Dial Face -->
          <circle cx="300" cy="310" r="88" fill="#020617"/>
          <!-- Subdials -->
          <circle cx="300" cy="272" r="22" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>
          <circle cx="265" cy="335" r="20" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>
          <circle cx="335" cy="335" r="20" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>
          <!-- Hands -->
          <line x1="300" y1="310" x2="300" y2="245" stroke="#f8fafc" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="300" y1="310" x2="348" y2="295" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="300" y1="310" x2="275" y2="360" stroke="${accent}" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="300" cy="310" r="5" fill="${accent}"/>
          <!-- Crown -->
          <rect x="415" y="298" width="12" height="24" rx="3" fill="#64748b" stroke="#94a3b8" stroke-width="1.5"/>
        </g>
      `;

    case 'headphones':
      return `
        <!-- Wireless Studio Headphones -->
        <g id="headphones-graphic">
          <!-- Headband Arch -->
          <path d="M190,320 C185,150 415,150 410,320" fill="none" stroke="#1e293b" stroke-width="26" stroke-linecap="round"/>
          <path d="M205,300 C200,170 400,170 395,300" fill="none" stroke="#475569" stroke-width="10" stroke-linecap="round"/>
          <!-- Left Ear Cup Assembly -->
          <g transform="translate(170, 270)">
            <ellipse cx="20" cy="50" rx="36" ry="60" fill="#0f172a" stroke="#94a3b8" stroke-width="3"/>
            <ellipse cx="20" cy="50" rx="26" ry="46" fill="#1e293b"/>
            <!-- Acoustic Grill Ring -->
            <circle cx="20" cy="50" r="16" fill="none" stroke="${accent}" stroke-width="2"/>
            <circle cx="20" cy="50" r="6" fill="${accent}"/>
          </g>
          <!-- Right Ear Cup Assembly -->
          <g transform="translate(390, 270)">
            <ellipse cx="20" cy="50" rx="36" ry="60" fill="#0f172a" stroke="#94a3b8" stroke-width="3"/>
            <ellipse cx="20" cy="50" rx="26" ry="46" fill="#1e293b"/>
            <!-- Acoustic Grill Ring -->
            <circle cx="20" cy="50" r="16" fill="none" stroke="${accent}" stroke-width="2"/>
            <circle cx="20" cy="50" r="6" fill="${accent}"/>
          </g>
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
        <!-- Apothecary Botanical Serum Dropper -->
        <g id="serum-graphic">
          <!-- Glass Dropper Bottle Body -->
          <rect x="250" y="230" width="100" height="195" rx="14" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
          <!-- Amber Liquid Level -->
          <rect x="258" y="270" width="84" height="145" rx="8" fill="#047857" fill-opacity="0.75"/>
          <!-- Graduated Pipette Tube -->
          <rect x="294" y="160" width="12" height="235" rx="3" fill="#ecfdf5" fill-opacity="0.85" stroke="#6ee7b7" stroke-width="1.2"/>
          <!-- Pipette Measurement Lines -->
          <line x1="294" y1="280" x2="302" y2="280" stroke="#065f46" stroke-width="1.5"/>
          <line x1="294" y1="310" x2="302" y2="310" stroke="#065f46" stroke-width="1.5"/>
          <line x1="294" y1="340" x2="302" y2="340" stroke="#065f46" stroke-width="1.5"/>
          <!-- Bottle Shoulder & Cap Collar -->
          <rect x="270" y="205" width="60" height="25" rx="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
          <!-- Rubber Bulb Pipette Squeeze -->
          <path d="M280,205 C275,145 325,145 320,205 Z" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
          <!-- Clean Label Placard -->
          <rect x="264" y="300" width="72" height="70" rx="4" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
          <text x="300" y="325" text-anchor="middle" fill="#0f172a" font-size="8" font-weight="bold" font-family="sans-serif">BIO-SERUM</text>
          <text x="300" y="340" text-anchor="middle" fill="#059669" font-size="7" font-weight="bold" font-family="sans-serif">100% BOTANICAL</text>
          <text x="300" y="355" text-anchor="middle" fill="#64748b" font-size="6" font-family="sans-serif">30 ML / 1.0 FL OZ</text>
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
  const { productId, styleId, environmentId, lightingId, seed, variationIndex } = params;

  // Deterministic seed variations
  const seedAngle = ((seed % 15) - 7) + (variationIndex * 4);
  const scalePercent = 95 + (seed % 10);
  const horizontalShift = ((seed % 30) - 15);
  const sunBeamX = 100 + (seed % 150);

  // Environment backdrop rendering
  let envSvg = '';

  switch (environmentId) {
    case 'scandi-living-room':
      envSvg = `
        <defs>
          <linearGradient id="scandiWall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="60%" stop-color="#f1f5f9"/>
            <stop offset="100%" stop-color="#e2e8f0"/>
          </linearGradient>
          <linearGradient id="scandiFloor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#e2d4be"/>
            <stop offset="100%" stop-color="#cbb69d"/>
          </linearGradient>
        </defs>
        <!-- Back Wall -->
        <rect width="600" height="400" fill="url(#scandiWall)"/>
        <!-- Oak Wood Floor -->
        <rect y="400" width="600" height="200" fill="url(#scandiFloor)"/>
        <line x1="0" y1="440" x2="600" y2="440" stroke="#b8a186" stroke-width="1.5" opacity="0.6"/>
        <line x1="0" y1="490" x2="600" y2="490" stroke="#b8a186" stroke-width="1.5" opacity="0.6"/>
        <line x1="0" y1="545" x2="600" y2="545" stroke="#b8a186" stroke-width="1.5" opacity="0.6"/>
        <!-- Scandinavian Floor-to-Ceiling Architectural Window -->
        <g transform="translate(30, 40)">
          <rect width="160" height="340" rx="4" fill="#93c5fd" fill-opacity="0.35" stroke="#64748b" stroke-width="5"/>
          <line x1="80" y1="0" x2="80" y2="340" stroke="#64748b" stroke-width="3"/>
          <line x1="0" y1="170" x2="160" y2="170" stroke="#64748b" stroke-width="3"/>
          <!-- Sheer curtain drape -->
          <path d="M-10,-5 Q25,160 10,345" stroke="#ffffff" stroke-width="24" stroke-linecap="round" opacity="0.6" fill="none"/>
        </g>
        <!-- Minimalist line art frame on wall -->
        <g transform="translate(420, 70)">
          <rect width="110" height="140" rx="2" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
          <circle cx="55" cy="70" r="30" fill="none" stroke="#64748b" stroke-width="2"/>
          <path d="M35,90 Q55,40 75,90" stroke="#0f172a" stroke-width="2.5" fill="none"/>
        </g>
        <!-- Fiddle-leaf fig plant in corner -->
        <g transform="translate(490, 310)">
          <ellipse cx="40" cy="110" rx="24" ry="12" fill="#78716c"/>
          <path d="M40,110 L40,0" stroke="#15803d" stroke-width="4"/>
          <ellipse cx="25" cy="40" rx="26" ry="16" fill="#16a34a" transform="rotate(-30 25 40)"/>
          <ellipse cx="60" cy="20" rx="28" ry="18" fill="#15803d" transform="rotate(25 60 20)"/>
          <ellipse cx="30" cy="-15" rx="30" ry="19" fill="#166534" transform="rotate(-15 30 -15)"/>
        </g>
      `;
      break;

    case 'midcentury-penthouse':
      envSvg = `
        <defs>
          <linearGradient id="penthouseSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#020617"/>
            <stop offset="70%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e1b4b"/>
          </linearGradient>
          <linearGradient id="penthouseFloor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#090d16"/>
          </linearGradient>
        </defs>
        <!-- Floor & Skyline Glass Window -->
        <rect width="600" height="390" fill="url(#penthouseSky)"/>
        <rect y="390" width="600" height="210" fill="url(#penthouseFloor)"/>
        <!-- City High-Rise Skyline Silhouettes -->
        <g fill="#0b0f19" opacity="0.95">
          <rect x="20" y="140" width="65" height="250"/>
          <rect x="95" y="90" width="80" height="300"/>
          <rect x="190" y="170" width="70" height="220"/>
          <rect x="275" y="110" width="85" height="280"/>
          <rect x="380" y="70" width="95" height="320"/>
          <rect x="490" y="150" width="75" height="240"/>
        </g>
        <!-- Glowing Skyline Windows -->
        <g fill="#fef08a" opacity="0.65">
          <circle cx="120" cy="130" r="2"/><circle cx="140" cy="160" r="2"/><circle cx="130" cy="200" r="2"/>
          <circle cx="410" cy="110" r="2"/><circle cx="430" cy="140" r="2"/><circle cx="420" cy="190" r="2"/>
        </g>
        <!-- Walnut Wood Slat Accent Wall on Right -->
        <g transform="translate(500, 0)">
          <rect width="100" height="390" fill="#451a03"/>
          <line x1="20" y1="0" x2="20" y2="390" stroke="#78350f" stroke-width="4"/>
          <line x1="45" y1="0" x2="45" y2="390" stroke="#78350f" stroke-width="4"/>
          <line x1="70" y1="0" x2="70" y2="390" stroke="#78350f" stroke-width="4"/>
        </g>
        <!-- Brass Floor Lamp standing in room -->
        <g transform="translate(80, 180)">
          <ellipse cx="20" cy="210" rx="20" ry="6" fill="#ca8a04"/>
          <line x1="20" y1="210" x2="20" y2="20" stroke="#eab308" stroke-width="3"/>
          <ellipse cx="20" cy="20" rx="25" ry="12" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
        </g>
      `;
      break;

    case 'concrete-kitchen':
      envSvg = `
        <defs>
          <linearGradient id="concreteWall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#cbd5e1"/>
            <stop offset="100%" stop-color="#94a3b8"/>
          </linearGradient>
          <linearGradient id="kitchenCounter" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="100%" stop-color="#e2e8f0"/>
          </linearGradient>
        </defs>
        <!-- Fluted Plaster Wall -->
        <rect width="600" height="420" fill="url(#concreteWall)"/>
        <g stroke="#64748b" stroke-width="2" opacity="0.3">
          <line x1="60" y1="0" x2="60" y2="420"/><line x1="120" y1="0" x2="120" y2="420"/>
          <line x1="180" y1="0" x2="180" y2="420"/><line x1="240" y1="0" x2="240" y2="420"/>
          <line x1="400" y1="0" x2="400" y2="420"/><line x1="460" y1="0" x2="460" y2="420"/>
          <line x1="520" y1="0" x2="520" y2="420"/>
        </g>
        <!-- Marble Waterfall Kitchen Island -->
        <rect y="420" width="600" height="180" fill="url(#kitchenCounter)"/>
        <!-- Marble veining across island surface -->
        <path d="M0,450 Q180,430 350,470 T600,440" stroke="#94a3b8" stroke-width="1.6" opacity="0.4" fill="none"/>
        <path d="M50,510 Q280,480 480,530" stroke="#94a3b8" stroke-width="1.2" opacity="0.35" fill="none"/>
        <!-- Modern Matte Black Pendant Light -->
        <line x1="300" y1="0" x2="300" y2="140" stroke="#0f172a" stroke-width="2.5"/>
        <path d="M260,180 L340,180 L320,140 L280,140 Z" fill="#0f172a"/>
        <ellipse cx="300" cy="180" rx="40" ry="10" fill="#fef08a" opacity="0.8"/>
      `;
      break;

    case 'desert-patio':
      envSvg = `
        <defs>
          <linearGradient id="desertSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fdba74"/>
            <stop offset="60%" stop-color="#f97316"/>
            <stop offset="100%" stop-color="#c2410c"/>
          </linearGradient>
          <linearGradient id="terracottaFloor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#9a3412"/>
          </linearGradient>
        </defs>
        <!-- Desert Sunset Horizon -->
        <rect width="600" height="380" fill="url(#desertSky)"/>
        <!-- Distant Mountains -->
        <path d="M0,320 L120,240 L280,310 L440,220 L600,300 L600,380 L0,380 Z" fill="#9a3412" opacity="0.75"/>
        <!-- Adobe Stucco Wall with Courtyard Archway -->
        <path d="M0,0 H600 V380 H460 V220 A160,160 0 0,0 140,220 V380 H0 Z" fill="#fed7aa"/>
        <!-- Terracotta Tile Paver Floor -->
        <rect y="380" width="600" height="220" fill="url(#terracottaFloor)"/>
        <g stroke="#7c2d12" stroke-width="2" opacity="0.6">
          <line x1="0" y1="430" x2="600" y2="430"/><line x1="0" y1="490" x2="600" y2="490"/>
          <line x1="0" y1="550" x2="600" y2="550"/>
        </g>
        <!-- Potted Saguaro Cactus on Left -->
        <g transform="translate(60, 270)">
          <ellipse cx="30" cy="110" rx="20" ry="8" fill="#7c2d12"/>
          <rect x="15" y="90" width="30" height="25" fill="#ea580c" stroke="#9a3412" stroke-width="2"/>
          <!-- Cactus stem -->
          <rect x="24" y="10" width="12" height="85" rx="6" fill="#15803d"/>
          <path d="M12,45 H24 M12,30 V45" stroke="#15803d" stroke-width="8" stroke-linecap="round" fill="none"/>
          <path d="M36,55 H48 M48,40 V55" stroke="#15803d" stroke-width="8" stroke-linecap="round" fill="none"/>
        </g>
      `;
      break;

    case 'wabi-sabi-study':
    default:
      envSvg = `
        <defs>
          <linearGradient id="wabiWall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#e7e5e4"/>
            <stop offset="100%" stop-color="#d6d3d1"/>
          </linearGradient>
          <linearGradient id="tatamiFloor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#e7e5e4"/>
            <stop offset="100%" stop-color="#a8a29e"/>
          </linearGradient>
        </defs>
        <!-- Natural Wall -->
        <rect width="600" height="400" fill="url(#wabiWall)"/>
        <!-- Tatami Grid Floor -->
        <rect y="400" width="600" height="200" fill="url(#tatamiFloor)"/>
        <line x1="300" y1="400" x2="300" y2="600" stroke="#78716c" stroke-width="3"/>
        <line x1="0" y1="500" x2="600" y2="500" stroke="#78716c" stroke-width="2"/>
        <!-- Japanese Shoji Sliding Screen on Left -->
        <g transform="translate(40, 20)">
          <rect width="180" height="380" fill="#fafaf9" stroke="#44403c" stroke-width="6"/>
          <!-- Shoji Grid lines -->
          <line x1="60" y1="0" x2="60" y2="380" stroke="#78716c" stroke-width="2"/>
          <line x1="120" y1="0" x2="120" y2="380" stroke="#78716c" stroke-width="2"/>
          <line x1="0" y1="60" x2="180" y2="60" stroke="#78716c" stroke-width="2"/>
          <line x1="0" y1="120" x2="180" y2="120" stroke="#78716c" stroke-width="2"/>
          <line x1="0" y1="180" x2="180" y2="180" stroke="#78716c" stroke-width="2"/>
          <line x1="0" y1="240" x2="180" y2="240" stroke="#78716c" stroke-width="2"/>
          <line x1="0" y1="300" x2="180" y2="300" stroke="#78716c" stroke-width="2"/>
        </g>
        <!-- Ceramic Vase with a natural branch on right -->
        <g transform="translate(480, 290)">
          <ellipse cx="25" cy="110" rx="20" ry="7" fill="#57534e"/>
          <path d="M12,110 Q5,60 25,60 Q45,60 38,110 Z" fill="#292524"/>
          <!-- Branch -->
          <path d="M25,60 Q35,20 15,-10 M25,40 Q45,10 50,-5" stroke="#44403c" stroke-width="2.5" fill="none"/>
          <circle cx="15" cy="-10" r="3.5" fill="#f43f5e"/>
          <circle cx="50" cy="-5" r="3.5" fill="#f43f5e"/>
        </g>
      `;
      break;
  }

  // Lifestyle lighting stream
  let lightingBeamSvg = '';
  switch (lightingId) {
    case 'golden-hour-window':
      lightingBeamSvg = `
        <defs>
          <linearGradient id="goldenBeam" x1="${sunBeamX}px" y1="0px" x2="550px" y2="600px" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.45"/>
            <stop offset="40%" stop-color="#fbbf24" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#d97706" stop-opacity="0.03"/>
          </linearGradient>
        </defs>
        <polygon points="${sunBeamX},0 ${sunBeamX + 180},0 600,480 340,600" fill="url(#goldenBeam)" pointer-events="none"/>
      `;
      break;

    case 'dappled-sunbeams':
      lightingBeamSvg = `
        <defs>
          <radialGradient id="dappledLight" cx="60%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
            <stop offset="50%" stop-color="#fef08a" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.15"/>
          </radialGradient>
        </defs>
        <rect width="600" height="600" fill="url(#dappledLight)" pointer-events="none"/>
        <!-- Dappled leaf shadows -->
        <g fill="#000000" opacity="0.25" filter="blur(8px)">
          <ellipse cx="220" cy="380" rx="45" ry="25"/>
          <ellipse cx="310" cy="410" rx="60" ry="30"/>
          <ellipse cx="400" cy="360" rx="50" ry="20"/>
          <ellipse cx="260" cy="460" rx="35" ry="18"/>
        </g>
      `;
      break;

    case 'twilight-ambient':
      lightingBeamSvg = `
        <defs>
          <radialGradient id="lampGlow" cx="50%" cy="55%" r="45%">
            <stop offset="0%" stop-color="#fef08a" stop-opacity="0.5"/>
            <stop offset="35%" stop-color="#f59e0b" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#020617" stop-opacity="0.6"/>
          </radialGradient>
        </defs>
        <rect width="600" height="600" fill="url(#lampGlow)" pointer-events="none"/>
      `;
      break;

    case 'bright-morning':
    default:
      lightingBeamSvg = `
        <defs>
          <linearGradient id="morningLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28"/>
            <stop offset="60%" stop-color="#ffffff" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.12"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#morningLight)" pointer-events="none"/>
      `;
      break;
  }

  // Lifestyle product graphic
  const productSvg = renderLifestyleProductGraphic(productId, seed, styleId);

  // Full SVG Document
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
      ${envSvg}

      <!-- Lifestyle Product Positioned in Scene with Seed Offset -->
      <g transform="translate(${300 + horizontalShift}, 360) scale(${scalePercent / 100}) rotate(${seedAngle}) translate(-300, -360)">
        <!-- Natural Contact Ground Shadow -->
        <ellipse cx="300" cy="465" rx="140" ry="18" fill="rgba(0,0,0,0.35)" filter="blur(7px)"/>
        ${productSvg}
      </g>

      ${lightingBeamSvg}

      <!-- Editorial Frame Overlay -->
      <rect width="600" height="600" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
    </svg>
  `;

  const encoded = encodeURIComponent(svgContent.trim())
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

function renderLifestyleProductGraphic(productId: string, seed: number, styleId: string): string {
  const accent = getAccentColorForStyle(styleId, seed);

  switch (productId) {
    case 'lounge-chair':
      return `
        <!-- Minimalist Boucle Lounge Chair in Room -->
        <g id="boucle-chair">
          <!-- Walnut Wood Frame Legs -->
          <line x1="220" y1="360" x2="190" y2="465" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
          <line x1="380" y1="360" x2="410" y2="465" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
          <line x1="260" y1="370" x2="240" y2="455" stroke="#451a03" stroke-width="7" stroke-linecap="round"/>
          <line x1="340" y1="370" x2="360" y2="455" stroke="#451a03" stroke-width="7" stroke-linecap="round"/>
          <!-- Chair Base Ring Support -->
          <ellipse cx="300" cy="380" rx="100" ry="24" fill="#78350f"/>
          <!-- Curved Boucle Armrest Backing -->
          <path d="M190,320 C180,210 420,210 410,320 C400,380 200,380 190,320 Z" fill="#f8fafc" stroke="#e2e8f0" stroke-width="3"/>
          <!-- Deep Boucle Seat Cushion -->
          <ellipse cx="300" cy="350" rx="90" ry="35" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2.5"/>
          <!-- Accent Pillow -->
          <ellipse cx="320" cy="310" rx="35" ry="25" fill="${accent}" transform="rotate(15 320 310)"/>
        </g>
      `;

    case 'ceramic-lamp':
      return `
        <!-- Architectural Ceramic Table Lamp on Credenza -->
        <g id="ceramic-lamp-lifestyle">
          <!-- Wooden Side Table Surface -->
          <rect x="180" y="420" width="240" height="24" rx="4" fill="#78350f" stroke="#92400e" stroke-width="2"/>
          <line x1="210" y1="444" x2="210" y2="475" stroke="#451a03" stroke-width="8"/>
          <line x1="390" y1="444" x2="390" y2="475" stroke="#451a03" stroke-width="8"/>
          <!-- Ceramic Base -->
          <ellipse cx="300" cy="415" rx="50" ry="16" fill="#c2410c"/>
          <path d="M250,415 Q240,320 285,290 L315,290 Q360,320 350,415 Z" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
          <!-- Linen Cylindrical Lampshade with Warm Glow -->
          <rect x="235" y="170" width="130" height="110" rx="6" fill="#fef3c7" stroke="#fde68a" stroke-width="3"/>
          <!-- Light pool cast from shade -->
          <ellipse cx="300" cy="425" rx="95" ry="18" fill="#fef08a" opacity="0.55"/>
        </g>
      `;

    case 'speaker':
      return `
        <!-- Portable Aluminum Bluetooth Speaker on Styled Table -->
        <g id="lifestyle-speaker">
          <!-- Styled Coffee Table Edge -->
          <ellipse cx="300" cy="430" rx="140" ry="24" fill="#e2d4be" stroke="#b8a186" stroke-width="3"/>
          <!-- Art Book under Speaker -->
          <rect x="220" y="390" width="160" height="26" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>
          <rect x="225" y="386" width="150" height="6" fill="#ffffff"/>
          <!-- Speaker Body -->
          <rect x="245" y="270" width="110" height="115" rx="22" fill="#334155" stroke="#94a3b8" stroke-width="3"/>
          <!-- Speaker Grille Acoustic Ring -->
          <circle cx="300" cy="328" r="32" fill="#0f172a" stroke="${accent}" stroke-width="2"/>
          <circle cx="300" cy="328" r="14" fill="${accent}"/>
          <!-- Leather Handle Arch -->
          <path d="M260,270 C260,210 340,210 340,270" fill="none" stroke="#9a3412" stroke-width="7" stroke-linecap="round"/>
        </g>
      `;

    case 'pour-over':
      return `
        <!-- Handcrafted Ceramic Pour-Over Set with Coffee Steam -->
        <g id="lifestyle-pourover">
          <!-- Kitchen Counter Surface -->
          <rect x="180" y="430" width="240" height="25" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
          <!-- Borosilicate Glass Carafe -->
          <path d="M270,330 L330,330 L350,420 L250,420 Z" fill="#e0f2fe" fill-opacity="0.75" stroke="#38bdf8" stroke-width="2"/>
          <!-- Dark Brewed Coffee Level -->
          <path d="M255,380 L345,380 L348,418 L252,418 Z" fill="#451a03"/>
          <!-- Ceramic Dripper Cone -->
          <polygon points="260,330 340,330 365,240 235,240" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/>
          <rect x="245" y="235" width="110" height="8" rx="4" fill="#64748b"/>
          <!-- Steam trails -->
          <path d="M290,225 Q280,180 300,150 T295,120" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>
          <path d="M310,225 Q320,180 305,150 T315,120" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.4" stroke-linecap="round"/>
        </g>
      `;

    case 'sunglasses':
      return `
        <!-- Designer Acetate Sunglasses on Travertine Tray -->
        <g id="lifestyle-sunglasses">
          <!-- Travertine Marble Catchall Tray -->
          <ellipse cx="300" cy="400" rx="130" ry="40" fill="#fef3c7" stroke="#d4b996" stroke-width="3"/>
          <!-- Sunglasses Folded Frame -->
          <g transform="translate(230, 360)">
            <!-- Left Lens & Rim -->
            <rect x="0" y="0" width="60" height="42" rx="12" fill="#1e1b4b" stroke="#78350f" stroke-width="5"/>
            <!-- Right Lens & Rim -->
            <rect x="80" y="0" width="60" height="42" rx="12" fill="#1e1b4b" stroke="#78350f" stroke-width="5"/>
            <!-- Bridge -->
            <path d="M60,14 Q70,8 80,14" stroke="#78350f" stroke-width="5" fill="none"/>
            <!-- Temple Arm Folded -->
            <line x1="5" y1="8" x2="135" y2="30" stroke="#92400e" stroke-width="4"/>
            <!-- Lens Specular Glint -->
            <line x1="12" y1="8" x2="45" y2="32" stroke="#ffffff" stroke-width="2" opacity="0.6"/>
            <line x1="92" y1="8" x2="125" y2="32" stroke="#ffffff" stroke-width="2" opacity="0.6"/>
          </g>
        </g>
      `;

    case 'duffle':
    default:
      return `
        <!-- Full-Grain Leather Weekender Duffle in Room -->
        <g id="lifestyle-duffle">
          <!-- Duffle Body Cylinder -->
          <rect x="200" y="320" width="200" height="110" rx="35" fill="#78350f" stroke="#451a03" stroke-width="3.5"/>
          <!-- End Cap Panel -->
          <ellipse cx="205" cy="375" rx="16" ry="50" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
          <!-- Brass Zipper Track & Pull -->
          <line x1="220" y1="320" x2="380" y2="320" stroke="#facc15" stroke-width="3"/>
          <!-- Reinforced Leather Straps -->
          <path d="M260,320 V425 M340,320 V425" stroke="#451a03" stroke-width="6"/>
          <!-- Rolled Top Handles Arch -->
          <path d="M255,320 C250,240 345,240 345,320" fill="none" stroke="#451a03" stroke-width="8" stroke-linecap="round"/>
          <!-- Hanging Leather Luggage Tag -->
          <rect x="270" y="335" width="22" height="34" rx="3" fill="#b45309" stroke="#facc15" stroke-width="1.5"/>
        </g>
      `;
  }
}

