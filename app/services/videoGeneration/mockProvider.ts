import { VideoGenerationProvider, VideoGenerationRequest, VideoGenerationResponse } from './types';

export class MockVideoGenerationProvider implements VideoGenerationProvider {
  readonly id = 'mock-video-engine';
  readonly name = 'Internal Studio Neural Video Mock Engine v3.2';

  async generate(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    // 1. Validate configuration
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new Error('Video generation prompt cannot be empty. Please enter or reset the directives.');
    }

    if (!request.productId) {
      throw new Error('A product must be selected for the video pipeline.');
    }

    // Optional error simulation hook if prompt contains "[error]" or "[fail]"
    if (request.prompt.toLowerCase().includes('[error]') || request.prompt.toLowerCase().includes('[fail]')) {
      throw new Error('Video cluster temporal synthesis timed out while encoding frame sequence. Please retry.');
    }

    // 2. Realistic video generation latency simulation (1.6s - 2.2s)
    const latency = 1600 + Math.floor(Math.random() * 600);
    await new Promise((resolve) => setTimeout(resolve, latency));

    const seed = request.seed ?? Math.floor(10000000 + Math.random() * 90000000);
    const variationIndex = request.variationIndex ?? 0;

    const isFashion = request.workflowType === 'fashion-video';

    // 3. Generate deterministic animated video representation
    const videoGraphicUrl = isFashion
      ? generateProceduralFashionVideoGraphic({
          ...request,
          seed,
          variationIndex,
        })
      : generateProceduralVideoGraphic({
          ...request,
          seed,
          variationIndex,
        });

    const trajectories = isFashion
      ? [
          'Smooth Low-Angle Tracking Dolly',
          'Dynamic 4s Arc Push-In',
          'Slow-Mo Steadicam Catwalk Track',
          'Rising Pedestal Silhouette Frame',
          'Fast Orbiting Runway Steadicam Ring',
        ]
      : [
          '360° Continuous Orbital Loop (Clockwise)',
          '180° Half-Orbit Arc with Low Angle Rise',
          'Macro Push-In with 45° Pitch Lock',
          'Lateral Dolly Crane with Rack Focus',
          'Spiral Helical Descent around Hero Axes',
        ];
    const motionTrajectory = trajectories[(variationIndex + (seed % trajectories.length)) % trajectories.length];

    // Duration is strictly 0:04 for fashion video, or 0:06-0:08 for product video
    const duration = isFashion ? '0:04' : (request.qualityId === '4k' ? '0:08' : '0:06');

    return {
      id: isFashion ? `fsh-${seed.toString().slice(0, 6)}` : `vid-${seed.toString().slice(0, 6)}`,
      seed,
      duration,
      fps: 60,
      resolution: request.resolution,
      aspectRatio: request.aspectRatioId,
      videoGraphicUrl,
      productName: request.productName,
      styleName: request.styleName,
      cameraMovementName: request.cameraMovementName,
      backgroundName: request.backgroundName,
      lightingName: request.lightingName,
      qualityName: request.qualityName,
      prompt: request.prompt,
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
  const { productId, backgroundId, lightingId, seed, variationIndex } = params;

  // Derive deterministic parameters
  const animDuration = 4 + (seed % 3); // 4s to 6s loop duration
  const isClockwise = (seed + variationIndex) % 2 === 0;
  const accentColor = getAccentForSeed(seed);

  // Background environment setup
  let bgSvg = '';
  let pedestalSvg = '';

  switch (backgroundId) {
    case 'mirror-neon':
      bgSvg = `
        <defs>
          <linearGradient id="bgVidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#090d16"/>
            <stop offset="65%" stop-color="#1e1035"/>
            <stop offset="100%" stop-color="#2e1065"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#bgVidGrad)"/>
        <!-- Mirror line and violet reflection floor -->
        <line x1="0" y1="440" x2="600" y2="440" stroke="#a855f7" stroke-width="2" opacity="0.6"/>
      `;
      pedestalSvg = `
        <ellipse cx="300" cy="445" rx="140" ry="24" fill="#3b0764" opacity="0.8"/>
        <ellipse cx="300" cy="440" rx="120" ry="16" fill="#1e1b4b" stroke="#c084fc" stroke-width="1.5"/>
      `;
      break;

    case 'travertine-plinth':
      bgSvg = `
        <defs>
          <linearGradient id="bgVidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1c1917"/>
            <stop offset="50%" stop-color="#292524"/>
            <stop offset="100%" stop-color="#44403c"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#bgVidGrad)"/>
      `;
      pedestalSvg = `
        <!-- Travertine Block -->
        <g transform="translate(180, 420)">
          <rect width="240" height="50" rx="4" fill="#d4b996" stroke="#b8a186" stroke-width="2"/>
          <ellipse cx="120" cy="0" rx="120" ry="18" fill="#fef3c7" stroke="#b8a186" stroke-width="1.5"/>
        </g>
      `;
      break;

    case 'pure-white-infinity':
      bgSvg = `
        <defs>
          <linearGradient id="bgVidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="70%" stop-color="#f8fafc"/>
            <stop offset="100%" stop-color="#e2e8f0"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#bgVidGrad)"/>
      `;
      pedestalSvg = `
        <ellipse cx="300" cy="445" rx="130" ry="18" fill="rgba(0,0,0,0.15)" filter="blur(6px)"/>
      `;
      break;

    case 'cyber-grid':
      bgSvg = `
        <defs>
          <linearGradient id="bgVidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#030712"/>
            <stop offset="70%" stop-color="#0b0f19"/>
            <stop offset="100%" stop-color="#111827"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#bgVidGrad)"/>
        <!-- Perspective Grid -->
        <g stroke="#06b6d4" stroke-width="1" opacity="0.3">
          <line x1="300" y1="360" x2="0" y2="600"/>
          <line x1="300" y1="360" x2="150" y2="600"/>
          <line x1="300" y1="360" x2="450" y2="600"/>
          <line x1="300" y1="360" x2="600" y2="600"/>
          <line x1="100" y1="450" x2="500" y2="450"/>
          <line x1="50" y1="520" x2="550" y2="520"/>
        </g>
      `;
      pedestalSvg = `
        <ellipse cx="300" cy="440" rx="130" ry="18" fill="#0284c7" opacity="0.3" filter="blur(8px)"/>
        <ellipse cx="300" cy="440" rx="110" ry="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
      `;
      break;

    case 'obsidian-cyc':
    default:
      bgSvg = `
        <defs>
          <radialGradient id="bgVidGrad" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.6"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#030712"/>
          </radialGradient>
        </defs>
        <rect width="600" height="600" fill="url(#bgVidGrad)"/>
      `;
      pedestalSvg = `
        <ellipse cx="300" cy="448" rx="140" ry="20" fill="#000000" opacity="0.9" filter="blur(8px)"/>
        <ellipse cx="300" cy="440" rx="120" ry="16" fill="#090d16" stroke="#475569" stroke-width="2"/>
      `;
      break;
  }

  // Dynamic animated sweeping light beam
  let lightingBeamSvg = '';
  switch (lightingId) {
    case 'caustic-sweep':
      lightingBeamSvg = `
        <defs>
          <linearGradient id="causticSweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0"/>
            <stop offset="50%" stop-color="#c084fc" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#f43f5e" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <g>
          <path d="M-50,250 Q300,350 650,250" stroke="url(#causticSweep)" stroke-width="50" fill="none" opacity="0.7">
            <animate attributeName="d" 
              values="M-50,200 Q300,380 650,200; M-50,300 Q300,180 650,300; M-50,200 Q300,380 650,200" 
              dur="${animDuration}s" repeatCount="indefinite" />
          </path>
        </g>
      `;
      break;

    case 'chiaroscuro-beam':
      lightingBeamSvg = `
        <defs>
          <linearGradient id="chiaroBeam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
            <stop offset="35%" stop-color="#ffffff" stop-opacity="0.05"/>
            <stop offset="70%" stop-color="#000000" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
          </linearGradient>
        </defs>
        <polygon points="120,0 280,0 480,600 240,600" fill="url(#chiaroBeam)" opacity="0.6">
          <animate attributeName="points"
            values="120,0 280,0 480,600 240,600; 200,0 360,0 560,600 320,600; 120,0 280,0 480,600 240,600"
            dur="${animDuration}s" repeatCount="indefinite" />
        </polygon>
      `;
      break;

    case 'cyber-neon':
      lightingBeamSvg = `
        <!-- Cyber Dual-Tone Rim Flares -->
        <circle cx="120" cy="180" r="140" fill="#06b6d4" opacity="0.12" filter="blur(30px)"/>
        <circle cx="480" cy="220" r="140" fill="#ec4899" opacity="0.12" filter="blur(30px)"/>
      `;
      break;

    case 'continuous-rim':
    default:
      lightingBeamSvg = `
        <defs>
          <linearGradient id="rimSweep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
            <stop offset="50%" stop-color="#ffffff" stop-opacity="0"/>
            <stop offset="100%" stop-color="#818cf8" stop-opacity="0.3"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#rimSweep)" pointer-events="none"/>
      `;
      break;
  }

  // Product graphic with 360° motion keyframe transformation
  const productSvg = renderVideoProductGraphic(productId, accentColor);

  // Assemble animated SVG document with continuous orbital transformation
  const rotationDirection = isClockwise ? '360' : '-360';

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
      ${bgSvg}
      ${pedestalSvg}

      <!-- Center Orbital Motion Container with 60 FPS Keyframe Animation -->
      <g transform="translate(300, 310)">
        <!-- Continuous 360° Rotation or Pendulum Orbit Motion -->
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to="${rotationDirection} 0 0"
            dur="${animDuration}s"
            repeatCount="indefinite"
          />
          <!-- Gentle 3D floating inclination -->
          <g transform="scale(1, 0.96)">
            ${productSvg}
          </g>
        </g>
      </g>

      <!-- Dynamic Light Reflection Glint Sweeping Across -->
      <line x1="-100" y1="200" x2="100" y2="420" stroke="#ffffff" stroke-width="4" opacity="0.6" stroke-linecap="round">
        <animate attributeName="transform"
          type="translate"
          from="-150 0"
          to="650 0"
          dur="${animDuration}s"
          repeatCount="indefinite"
        />
      </line>

      ${lightingBeamSvg}

      <!-- Orbital Trajectory Guideline Arc (Subtle HUD accent) -->
      <ellipse cx="300" cy="310" rx="150" ry="40" fill="none" stroke="rgba(192, 132, 252, 0.25)" stroke-width="1.5" stroke-dasharray="6,6"/>

      <!-- Video Canvas Frame Border -->
      <rect width="600" height="600" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
    </svg>
  `;

  const encoded = encodeURIComponent(svgContent.trim())
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

function getAccentForSeed(seed: number): string {
  const accents = ['#a855f7', '#38bdf8', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
  return accents[seed % accents.length];
}

function renderVideoProductGraphic(productId: string, accent: string): string {
  switch (productId) {
    case 'jacket':
      return `
        <!-- Black Leather Jacket -->
        <g transform="translate(-300, -310)">
          <path d="M220,240 Q300,180 380,240 L390,360 L330,350 L310,480 L290,480 L270,350 L210,360 Z" fill="#0f172a" stroke="#cbd5e1" stroke-width="3"/>
          <line x1="300" y1="220" x2="300" y2="480" stroke="#cbd5e1" stroke-width="4"/>
          <!-- Zipper detail -->
          <rect x="296" y="240" width="8" height="15" rx="2" fill="${accent}"/>
          <path d="M230,260 Q260,250 270,300" stroke="#334155" stroke-width="3" fill="none"/>
          <path d="M370,260 Q340,250 330,300" stroke="#334155" stroke-width="3" fill="none"/>
        </g>
      `;

    case 'sneakers':
      return `
        <!-- White Sneakers -->
        <g transform="translate(-300, -310)">
          <path d="M210,350 Q230,280 290,290 L340,310 Q390,320 395,380 L380,410 L220,410 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="3"/>
          <!-- Sole -->
          <rect x="215" y="410" width="180" height="20" rx="10" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
          <!-- Accents -->
          <path d="M250,330 L320,310 L340,340 Z" fill="${accent}" opacity="0.8"/>
          <!-- Heel -->
          <path d="M210,350 Q205,380 220,410 L230,410 Q225,380 220,350 Z" fill="#334155"/>
          <!-- Laces -->
          <line x1="280" y1="295" x2="330" y2="330" stroke="#cbd5e1" stroke-width="4" stroke-dasharray="8,4"/>
        </g>
      `;

    case 'handbag':
      return `
        <!-- Luxury Handbag -->
        <g transform="translate(-300, -310)">
          <!-- Main Body -->
          <path d="M220,280 L380,280 L395,440 L205,440 Z" fill="#1e293b" stroke="#cbd5e1" stroke-width="3"/>
          <!-- Flap -->
          <path d="M220,280 L380,280 L360,350 L240,350 Z" fill="#0f172a"/>
          <!-- Gold Buckle -->
          <rect x="280" y="335" width="40" height="30" rx="4" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
          <!-- Handle -->
          <path d="M250,280 Q300,180 350,280" stroke="#1e293b" stroke-width="12" fill="none"/>
          <path d="M250,280 Q300,180 350,280" stroke="${accent}" stroke-width="4" fill="none"/>
        </g>
      `;

    case 'sunglasses':
    default:
      return `
        <!-- Stylish Sunglasses -->
        <g transform="translate(-300, -310)">
          <!-- Left Lens -->
          <rect x="200" y="260" width="90" height="70" rx="20" fill="#020617" stroke="#cbd5e1" stroke-width="4"/>
          <!-- Right Lens -->
          <rect x="310" y="260" width="90" height="70" rx="20" fill="#020617" stroke="#cbd5e1" stroke-width="4"/>
          <!-- Bridge -->
          <path d="M290,280 Q300,270 310,280" stroke="#cbd5e1" stroke-width="5" fill="none"/>
          <!-- Highlights -->
          <path d="M210,275 Q240,265 270,275" stroke="${accent}" stroke-width="4" fill="none" opacity="0.6"/>
          <path d="M320,275 Q350,265 380,275" stroke="${accent}" stroke-width="4" fill="none" opacity="0.6"/>
          <!-- Temples -->
          <line x1="200" y1="280" x2="160" y2="240" stroke="#0f172a" stroke-width="8" stroke-linecap="round"/>
          <line x1="400" y1="280" x2="440" y2="240" stroke="#0f172a" stroke-width="8" stroke-linecap="round"/>
        </g>
      `;
  }
}

function generateProceduralFashionVideoGraphic(params: SvgVideoParams): string {
  const { productId, backgroundId, lightingId, seed, variationIndex } = params;

  // STRICT 4.0s cycle
  const animDuration = 4;
  const accentColor = getFashionAccentForSeed(seed);
  const isAltStride = (seed + variationIndex) % 2 === 0;

  // Background environment setup
  let bgSvg = '';
  let runwayFloorSvg = '';

  switch (backgroundId) {
    case 'paris-catwalk':
      bgSvg = `
        <defs>
          <linearGradient id="parisCatwalkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#020617"/>
            <stop offset="50%" stop-color="#090d16"/>
            <stop offset="100%" stop-color="#1e1035"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#parisCatwalkGrad)"/>
        <!-- Fashion audience bokeh crowd -->
        <g fill="#475569" opacity="0.25">
          <circle cx="80" cy="380" r="18"/><circle cx="120" cy="390" r="14"/><circle cx="50" cy="420" r="22"/>
          <circle cx="520" cy="380" r="18"/><circle cx="480" cy="390" r="14"/><circle cx="550" cy="420" r="22"/>
        </g>
      `;
      runwayFloorSvg = `
        <!-- High Gloss Catwalk Mirror Floor -->
        <polygon points="180,360 420,360 520,600 80,600" fill="#030712" stroke="#a855f7" stroke-width="1.5" stroke-opacity="0.4"/>
        <line x1="300" y1="360" x2="300" y2="600" stroke="#c084fc" stroke-width="1.5" stroke-dasharray="8,8" opacity="0.4"/>
      `;
      break;

    case 'concrete-atrium':
      bgSvg = `
        <defs>
          <linearGradient id="atriumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#334155"/>
            <stop offset="60%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#atriumGrad)"/>
        <!-- Brutalist concrete columns -->
        <rect x="60" y="0" width="80" height="600" fill="#475569" opacity="0.35"/>
        <rect x="460" y="0" width="80" height="600" fill="#475569" opacity="0.35"/>
      `;
      runwayFloorSvg = `
        <polygon points="170,370 430,370 540,600 60,600" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5"/>
      `;
      break;

    case 'desert-dunes':
      bgSvg = `
        <defs>
          <linearGradient id="dunesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fb923c"/>
            <stop offset="45%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#7c2d12"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#dunesGrad)"/>
        <path d="M0,320 Q200,280 400,340 T600,300 L600,600 L0,600 Z" fill="#c2410c" opacity="0.8"/>
      `;
      runwayFloorSvg = `
        <path d="M120,600 Q280,480 300,370 Q320,480 480,600 Z" fill="#9a3412" opacity="0.7"/>
      `;
      break;

    case 'obsidian-mirror':
    default:
      bgSvg = `
        <defs>
          <radialGradient id="obsidianFashionGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.8"/>
            <stop offset="55%" stop-color="#090d16"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
        </defs>
        <rect width="600" height="600" fill="url(#obsidianFashionGrad)"/>
      `;
      runwayFloorSvg = `
        <polygon points="180,360 420,360 520,600 80,600" fill="#090d16" stroke="#e11d48" stroke-width="1" stroke-opacity="0.3"/>
        <ellipse cx="300" cy="520" rx="140" ry="24" fill="#fb7185" opacity="0.1" filter="blur(16px)"/>
      `;
      break;
  }

  // Lighting overlay
  let lightingSvg = '';
  switch (lightingId) {
    case 'catwalk-spotlights':
      lightingSvg = `
        <defs>
          <linearGradient id="spotFollow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
            <stop offset="40%" stop-color="#ffffff" stop-opacity="0.15"/>
            <stop offset="80%" stop-color="#ffffff" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polygon points="300,0 240,40 210,600 390,600" fill="url(#spotFollow)">
          <animate attributeName="points"
            values="300,0 240,40 210,600 390,600; 300,0 260,40 230,600 410,600; 300,0 240,40 210,600 390,600"
            dur="${animDuration}s" repeatCount="indefinite" />
        </polygon>
      `;
      break;

    case 'golden-rim':
      lightingSvg = `
        <defs>
          <radialGradient id="fashionSun" cx="80%" cy="20%" r="60%">
            <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.45"/>
            <stop offset="60%" stop-color="#d97706" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="600" height="600" fill="url(#fashionSun)" pointer-events="none"/>
      `;
      break;

    case 'cyber-magenta':
      lightingSvg = `
        <circle cx="100" cy="200" r="160" fill="#06b6d4" opacity="0.18" filter="blur(40px)"/>
        <circle cx="500" cy="240" r="160" fill="#f43f5e" opacity="0.2" filter="blur(40px)"/>
      `;
      break;

    case 'diffused-editorial':
    default:
      lightingSvg = `
        <defs>
          <linearGradient id="editorialWash" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2"/>
            <stop offset="50%" stop-color="#ffffff" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#editorialWash)" pointer-events="none"/>
      `;
      break;
  }

  // Model & Garment Graphic
  const modelSvg = renderFashionModelGraphic(productId, accentColor, isAltStride);

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
      ${bgSvg}
      ${runwayFloorSvg}

      <!-- 4-Second Animated Catwalk Runway Motion Container -->
      <g transform="translate(300, 320)">
        <!-- Natural striding cadence cycle over 4 seconds -->
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0, -10; 0, 8; 0, -10; 0, 8; 0, -10"
            dur="${animDuration}s"
            repeatCount="indefinite"
          />
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-2.5 0 0; 2.5 0 0; -2.5 0 0"
              dur="${animDuration}s"
              repeatCount="indefinite"
            />
            ${modelSvg}
          </g>
        </g>
      </g>

      <!-- Sweeping Runway Light Flares -->
      <line x1="-80" y1="180" x2="80" y2="440" stroke="#ffffff" stroke-width="3" opacity="0.5" stroke-linecap="round">
        <animate attributeName="transform"
          type="translate"
          from="-120 0"
          to="680 0"
          dur="${animDuration}s"
          repeatCount="indefinite"
        />
      </line>

      ${lightingSvg}

      <!-- 4s Fashion Reel HUD Indicator Overlay -->
      <g transform="translate(480, 40)">
        <rect width="80" height="26" rx="13" fill="rgba(0,0,0,0.6)" stroke="#f43f5e" stroke-width="1.2"/>
        <circle cx="16" cy="13" r="4" fill="#f43f5e">
          <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite"/>
        </circle>
        <text x="30" y="17" fill="#ffffff" font-size="10" font-weight="bold" font-family="sans-serif">0:04 60p</text>
      </g>

      <rect width="600" height="600" fill="none" stroke="rgba(244,63,94,0.25)" stroke-width="2"/>
    </svg>
  `;

  const encoded = encodeURIComponent(svgContent.trim())
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

function getFashionAccentForSeed(seed: number): string {
  const accents = ['#f43f5e', '#ec4899', '#a855f7', '#38bdf8', '#fbbf24', '#e11d48'];
  return accents[seed % accents.length];
}

function renderFashionModelGraphic(productId: string, accent: string, isAltStride: boolean): string {
  let garmentPath = '';

  switch (productId) {
    case 'silk-trench':
      garmentPath = `
        <!-- Silk Evening Trench Coat -->
        <g fill="#0f172a" stroke="${accent}" stroke-width="1.8">
          <!-- Flowing wide lapels & Coat Body -->
          <path d="M-40, -90 L40, -90 L55, 140 L-55, 140 Z"/>
          <!-- Flared billowing coat hemline with kinetic wave -->
          <path d="M-55, 140 Q0, 165 55, 140 L45, 10 M-55, 140 L-45, 10" fill="${accent}" fill-opacity="0.25"/>
          <!-- Belt tie sash dangling -->
          <path d="M-8, 0 Q-15, 60 -30, 90 M-4, 0 Q5, 50 12, 85" stroke="#ffffff" stroke-width="2.5" fill="none"/>
        </g>
      `;
      break;

    case 'organza-gown':
      garmentPath = `
        <!-- Pleated Organza Runway Gown -->
        <g stroke="${accent}" stroke-width="1.5">
          <!-- Translucent tiered skirt flaring dramatically -->
          <path d="M-22, -40 L22, -40 L85, 180 L-85, 180 Z" fill="${accent}" fill-opacity="0.35"/>
          <path d="M-18, 20 L18, 20 L65, 160 L-65, 160 Z" fill="#ffffff" fill-opacity="0.2"/>
          <path d="M-14, -20 L14, -20 L45, 120 L-45, 120 Z" fill="#ffffff" fill-opacity="0.25"/>
          <!-- Bodice corset -->
          <path d="M-22, -90 L22, -90 L20, -30 L-20, -30 Z" fill="#090d16"/>
        </g>
      `;
      break;

    case 'cashmere-knit':
      garmentPath = `
        <!-- Cashmere Oversized Turtleneck -->
        <g fill="#1e293b" stroke="#94a3b8" stroke-width="2">
          <!-- High turtleneck cowl collar -->
          <rect x="-24" y="-125" width="48" height="30" rx="8" fill="#334155" stroke="${accent}" stroke-width="1.5"/>
          <!-- Drop shoulder slouchy body -->
          <path d="M-60, -85 L60, -85 L48, 50 L-48, 50 Z"/>
          <!-- Ribbed hem -->
          <line x1="-48" y1="50" x2="48" y2="50" stroke="${accent}" stroke-width="3"/>
          <!-- Slouchy knit arms -->
          <path d="M-60, -85 L-75, 20 M60, -85 L75, 20" stroke="#334155" stroke-width="16" stroke-linecap="round"/>
        </g>
      `;
      break;

    case 'wool-blazer':
      garmentPath = `
        <!-- Structured Double-Breasted Wool Blazer -->
        <g fill="#020617" stroke="#475569" stroke-width="2">
          <!-- Sharp architectural shoulders -->
          <path d="M-55, -95 L55, -95 L40, 60 L-40, 60 Z"/>
          <!-- Peak lapels -->
          <polygon points="-55,-95 -10,-95 -20,-30" fill="${accent}" stroke="#f8fafc" stroke-width="1"/>
          <polygon points="55,-95 10,-95 20,-30" fill="${accent}" stroke="#f8fafc" stroke-width="1"/>
          <!-- Double-breasted buttons -->
          <circle cx="-10" cy="-20" r="3" fill="#fbbf24"/>
          <circle cx="10" cy="-20" r="3" fill="#fbbf24"/>
          <circle cx="-10" cy="15" r="3" fill="#fbbf24"/>
          <circle cx="10" cy="15" r="3" fill="#fbbf24"/>
        </g>
      `;
      break;

    case 'tailored-trousers':
      garmentPath = `
        <!-- High-Waisted Wide-Leg Trousers -->
        <g fill="#0f172a" stroke="${accent}" stroke-width="1.5">
          <path d="M-30, -50 L30, -50 L25, 20 L-25, 20 Z" fill="#1e293b"/>
          <!-- Wide billowing pant legs -->
          <path d="M-25, 10 L-4, 10 L-6, 195 L-48, 195 Z"/>
          <path d="M4, 10 L25, 10 L48, 195 L6, 195 Z"/>
          <line x1="-26" y1="30" x2="-28" y2="190" stroke="#cbd5e1" stroke-width="1.2" opacity="0.6"/>
          <line x1="26" y1="30" x2="28" y2="190" stroke="#cbd5e1" stroke-width="1.2" opacity="0.6"/>
        </g>
      `;
      break;

    case 'satin-slip':
    default:
      garmentPath = `
        <!-- Liquid Bias-Cut Satin Evening Slip Dress -->
        <g stroke="${accent}" stroke-width="1.8">
          <!-- Spaghetti straps -->
          <line x1="-15" y1="-105" x2="-12" y2="-80" stroke="#f8fafc" stroke-width="1.5"/>
          <line x1="15" y1="-105" x2="12" y2="-80" stroke="#f8fafc" stroke-width="1.5"/>
          <!-- Liquid satin body cascading to mid-calf -->
          <path d="M-22, -80 L22, -80 Q28, 20 40, 160 L-40, 160 Q-28, 20 -22, -80 Z" fill="#0f172a"/>
          <!-- Champagne satin sheen overlay -->
          <path d="M-10, -70 Q0, 40 18, 150" stroke="#fef08a" stroke-width="3" stroke-linecap="round" opacity="0.4" fill="none"/>
        </g>
      `;
      break;
  }

  return `
    <g id="fashion-model-figure">
      <!-- Ground Catwalk Reflection/Shadow -->
      <ellipse cx="0" cy="215" rx="55" ry="12" fill="rgba(0,0,0,0.6)" filter="blur(6px)"/>

      <!-- Striding Legs -->
      <line x1="-12" y1="120" x2="${isAltStride ? '-24' : '-16'}" y2="210" stroke="#334155" stroke-width="8" stroke-linecap="round"/>
      <line x1="12" y1="120" x2="${isAltStride ? '24' : '16'}" y2="210" stroke="#334155" stroke-width="8" stroke-linecap="round"/>
      <!-- Runway Shoes -->
      <rect x="${isAltStride ? '-30' : '-22'}" y="206" width="14" height="6" rx="2" fill="#020617"/>
      <rect x="${isAltStride ? '20' : '12'}" y="206" width="14" height="6" rx="2" fill="#020617"/>

      <!-- Main Garment Silhouette -->
      ${garmentPath}

      <!-- Model Head & Neck Silhouette -->
      <rect x="-8" y="-120" width="16" height="24" rx="4" fill="#64748b"/>
      <circle cx="0" cy="-135" r="16" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Sleek runway hair / profile -->
      <path d="M-16, -140 Q0, -155 16, -140 Q18, -125 10, -118 L-14, -125 Z" fill="#020617"/>
      <!-- Runway sunglasses / visor -->
      <rect x="-14" y="-136" width="28" height="6" rx="2" fill="${accent}"/>
    </g>
  `;
}
