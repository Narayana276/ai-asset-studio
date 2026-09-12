import { buildTemplatePrompt } from './templateLibrary';

export interface FashionOptionItem {
  id: string;
  name: string;
  description: string;
  previewColor?: string;
}

export const FASHION_PRODUCT_OPTIONS: FashionOptionItem[] = [
  {
    id: 'silk-trench',
    name: 'Silk Evening Trench Coat',
    description: 'Fluid iridescent silk with oversized lapels, waist tie, and dramatic movement',
  },
  {
    id: 'cashmere-knit',
    name: 'Cashmere Oversized Turtleneck',
    description: 'Ribbed ultra-soft cashmere knit with relaxed drop-shoulder drape',
  },
  {
    id: 'organza-gown',
    name: 'Pleated Organza Runway Gown',
    description: 'Layered translucent tiered organza with floating kinetic hemline',
  },
  {
    id: 'wool-blazer',
    name: 'Structured Double-Breasted Wool Blazer',
    description: 'Sharp architectural shoulders with peak lapels and horn buttons',
  },
  {
    id: 'satin-slip',
    name: 'Bias-Cut Satin Evening Slip Dress',
    description: 'Liquid champagne satin cascading with natural body movement',
  },
  {
    id: 'tailored-trousers',
    name: 'High-Waisted Wide-Leg Trousers',
    description: 'Heavy wool-twill trousers with deep pleats and graceful walking stride',
  },
];

export const FASHION_STYLE_OPTIONS: FashionOptionItem[] = [
  {
    id: 'haute-couture',
    name: 'Haute Couture Paris Runway',
    description: 'Prestigious runway pacing with dramatic lighting and high-fashion authority',
  },
  {
    id: 'quiet-luxury',
    name: 'Minimalist Quiet Luxury',
    description: 'Subtle elegance, natural unhurried cadence, and understated refinement',
  },
  {
    id: 'avant-garde',
    name: 'Avant-Garde High-Fashion',
    description: 'Bold expressive posture, geometric silhouettes, and striking editorial impact',
  },
  {
    id: 'streetwear-editorial',
    name: 'Contemporary Streetwear Editorial',
    description: 'Energetic urban stride with rhythmic movement and high-velocity focus',
  },
  {
    id: 'romantic-ethereal',
    name: 'Romantic Ethereal Drapes',
    description: 'Dreamlike fabric billowing, soft floating pauses, and whimsical motion',
  },
];

export const FASHION_MODEL_OPTIONS: FashionOptionItem[] = [
  {
    id: 'striding-runway',
    name: 'Confident Striding Runway Model',
    description: 'Brisk cadence walking towards camera with natural arm swing and garment stride',
  },
  {
    id: 'turn-and-stop',
    name: 'Dynamic 360 Turn & Stop',
    description: 'Fluid spinning pause showing 360-degree fabric flare before strong camera lock',
  },
  {
    id: 'fabric-drape-incline',
    name: 'Slow-Motion Fabric Drape Incline',
    description: 'Gentle step forward accentuating textile weight and undulating folds',
  },
  {
    id: 'wind-machine-strut',
    name: 'Wind Machine Flowing Strut',
    description: 'High-velocity frontal wind pushing fabric backward into trailing slipstream',
  },
  {
    id: 'pose-transition',
    name: 'Confident Editorial Pose Transition',
    description: 'Fast two-pose transition optimized for high-impact social scroll stopping',
  },
];

export const FASHION_BACKGROUND_OPTIONS: FashionOptionItem[] = [
  {
    id: 'paris-catwalk',
    name: 'Paris Runway Spotlight Catwalk',
    description: 'Glossy black mirror runway floor flanked by subtle crowd silhouette bokeh',
    previewColor: '#090d16',
  },
  {
    id: 'concrete-atrium',
    name: 'Concrete Architectural Atrium',
    description: 'Brutalist concrete pillars with skylight shafts illuminating the runway path',
    previewColor: '#94a3b8',
  },
  {
    id: 'backstage-studio',
    name: 'Milan Backstage Minimalist Studio',
    description: 'Clean industrial studio backdrop with metal garment racks and soft haze',
    previewColor: '#334155',
  },
  {
    id: 'desert-dunes',
    name: 'Warm Golden Sand Dunes',
    description: 'Expansive natural desert dunes with golden sand and dramatic sun flare',
    previewColor: '#f59e0b',
  },
  {
    id: 'obsidian-mirror',
    name: 'High-Gloss Obsidian Mirror Stage',
    description: 'Pure reflection stage with ambient deep violet and indigo edge glow',
    previewColor: '#2e1065',
  },
];

export const FASHION_CAMERA_OPTIONS: FashionOptionItem[] = [
  {
    id: 'low-angle-dolly',
    name: 'Smooth Low-Angle Tracking Dolly',
    description: 'Low-slung camera tracking backward as model strides forward at eye level',
  },
  {
    id: 'arc-pushin',
    name: 'Dynamic 4s Arc Push-In',
    description: 'Fast sweeping 90-degree arc ending in tight waist-up garment framing',
  },
  {
    id: 'slowmo-handheld',
    name: 'Slow-Mo Organic Steadicam Track',
    description: 'Smooth organic camera gliding alongside the garment flow and stride rhythm',
  },
  {
    id: 'rising-pedestal',
    name: 'Rising Pedestal Frame',
    description: 'Camera travels upward from footwear hemline to full silhouette portrait',
  },
  {
    id: 'orbiting-steadicam',
    name: 'Fast Orbiting Steadicam Ring',
    description: 'Full circular revolution completed within the 4-second micro-timeline',
  },
];

export const FASHION_LIGHTING_OPTIONS: FashionOptionItem[] = [
  {
    id: 'catwalk-spotlights',
    name: 'High-Contrast Catwalk Spotlights',
    description: 'Intense overhead directional follow-spots with dramatic drop shadow falloff',
  },
  {
    id: 'diffused-editorial',
    name: 'Soft Diffused Editorial Daylight',
    description: 'Large scrim daylight balance highlighting subtle fabric weave and true color',
  },
  {
    id: 'backlit-silhouette',
    name: 'Dramatic Backlit Silhouette & Rim',
    description: 'Powerful rear lighting creating a glowing halo rim along garment edges',
  },
  {
    id: 'golden-rim',
    name: 'Golden Hour Sunset Rim Radiance',
    description: 'Warm 3200K amber glow illuminating sheer hems and floating silk threads',
  },
  {
    id: 'cyber-magenta',
    name: 'Cyberpunk Magenta & Cyan Edge Flares',
    description: 'Dual-tone neon rim lighting for contemporary high-energy streetwear',
  },
];

// Default aspect ratio is 9:16 for social/mobile content
export const FASHION_ASPECT_RATIO_OPTIONS = [
  { id: '9:16', label: '9:16 (Stories / Reels / TikTok)', resolution: '1080 x 1920', aspectClass: 'aspect-[9/16]' },
  { id: '4:5', label: '4:5 (Instagram Feed)', resolution: '1080 x 1350', aspectClass: 'aspect-[4/5]' },
  { id: '1:1', label: '1:1 (Square Post)', resolution: '1080 x 1080', aspectClass: 'aspect-square' },
  { id: '16:9', label: '16:9 (Landscape Banner)', resolution: '1920 x 1080', aspectClass: 'aspect-[16/9]' },
];

export const FASHION_QUALITY_OPTIONS = [
  { id: '1080p', label: 'Standard 1080p Mobile', details: '60 FPS • 12 Mbps H.264' },
  { id: '2k', label: 'Production 2K HDR', details: '60 FPS • 24 Mbps H.265' },
  { id: '4k', label: 'Master 4K ProRes HQ', details: '60 FPS • 50 Mbps ProRes' },
];

// Duration is STRICTLY and IMMUTABLY 4 seconds
export const FASHION_VIDEO_DURATION = '0:04';
export const FASHION_VIDEO_DURATION_SECONDS = 4;

export function buildFashionVideoPrompt(params: {
  product: string;
  model: string;
  style: string;
  background: string;
  camera: string;
  lighting: string;
}): string {
  return buildTemplatePrompt('tmpl-fashion-video', params);
}
