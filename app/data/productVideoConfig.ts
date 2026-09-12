export interface VideoOptionItem {
  id: string;
  name: string;
  description: string;
  previewColor?: string;
}

export const VIDEO_PRODUCT_OPTIONS: VideoOptionItem[] = [
  {
    id: 'ceramic-watch',
    name: 'Luxury Ceramic Chronometer Watch',
    description: 'Deep obsidian ceramic bezel with brushed titanium accents and sapphire crystal',
  },
  {
    id: 'studio-headphones',
    name: 'Titanium Studio Wireless Headphones',
    description: 'Anodized aluminum earcups with memory-foam pads and acoustic micro-grills',
  },
  {
    id: 'perfume-bottle',
    name: 'Minimalist Glass Perfume Bottle',
    description: 'Faceted heavy crystal bottle with golden mist atomizing nozzle',
  },
  {
    id: 'drone',
    name: 'Carbon-Fiber Aerodynamic Drone',
    description: 'Folding quadcopter with carbon-weave arms and gimbal 4K sensor',
  },
  {
    id: 'mechanical-keyboard',
    name: 'Sculpted Aluminum Mechanical Keyboard',
    description: 'Low-profile CNC milled chassis with double-shot PBT keycaps',
  },
  {
    id: 'espresso-machine',
    name: 'Brushed Stainless Espresso Machine',
    description: 'Commercial group head, brass steam wand, and analog pressure gauge',
  },
];

export const VIDEO_STYLE_OPTIONS: VideoOptionItem[] = [
  {
    id: 'orbital-spin',
    name: '360° Cinematic Orbital Spin',
    description: 'Smooth continuous rotational showcase revealing all product facets and build materials',
  },
  {
    id: 'macro-pushin',
    name: 'Macro Push-In Feature Reveal',
    description: 'Slow dramatic push-in focusing closely on intricate micro-textures and engravings',
  },
  {
    id: 'hero-drift',
    name: 'Slow-Motion Floating Hero Drift',
    description: 'Zero-gravity levitating perspective with gentle rotational tilting and soft lighting glide',
  },
  {
    id: 'glint-flare',
    name: 'Dynamic Commercial Glint & Flare',
    description: 'High-energy studio light streaks sweeping across polished chamfers and crystal surfaces',
  },
  {
    id: 'seamless-loop',
    name: 'Seamless Infinite Loop Reel',
    description: 'Perfect 360-degree cyclical revolution engineered for infinite playback on mobile feeds',
  },
];

export const CAMERA_MOVEMENT_OPTIONS: VideoOptionItem[] = [
  {
    id: 'continuous-orbit',
    name: 'Smooth 360° Continuous Orbit',
    description: 'Clockwise rotational arc maintaining strict focal distance and zero motion shake',
  },
  {
    id: 'dolly-push',
    name: 'Dolly Push-In with Subtle Pitch',
    description: 'Smooth axial forward motion ending in tight 45° angled product lock',
  },
  {
    id: 'crane-sweep',
    name: 'Lateral Crane Sweep & Rack Focus',
    description: 'Sweeping horizontal slider arc transitioning focus from background to product hero',
  },
  {
    id: 'half-orbit',
    name: '180° Half-Orbit with Rising Angle',
    description: 'Semi-circular rotation lifting from low horizon to elevated 30° perspective',
  },
  {
    id: 'spiral-descent',
    name: 'Spiral Descent with Angle Lock',
    description: 'Helical top-down camera track spiraling down towards key interface features',
  },
];

export const VIDEO_BACKGROUND_OPTIONS: VideoOptionItem[] = [
  {
    id: 'obsidian-cyc',
    name: 'Dark Obsidian Studio with Pedestal',
    description: 'Deep black matte infinity background with subtle ground reflections and pedestal plinth',
    previewColor: '#090d16',
  },
  {
    id: 'mirror-neon',
    name: 'Polished Mirror with Violet Underglow',
    description: 'Glass reflection floor illuminated by soft violet and indigo ambient rim lights',
    previewColor: '#2e1065',
  },
  {
    id: 'travertine-plinth',
    name: 'Warm Architectural Travertine Plinth',
    description: 'Honed warm stone block contrasting organic mineral texture with precision product',
    previewColor: '#d4b996',
  },
  {
    id: 'pure-white-infinity',
    name: 'Pure White Infinite Cyclorama',
    description: 'Ultra-clean commercial studio cyclorama with soft contact drop shadow',
    previewColor: '#ffffff',
  },
  {
    id: 'cyber-grid',
    name: 'Dark Metallic Cyberpunk Grid',
    description: 'Sleek brushed titanium flooring with subtle luminous cyan alignment grid lines',
    previewColor: '#0f172a',
  },
];

export const VIDEO_LIGHTING_OPTIONS: VideoOptionItem[] = [
  {
    id: 'continuous-rim',
    name: 'Continuous Studio Key & Rim Light',
    description: 'Balanced 5600K key light with razor-sharp edge rim highlighting silhouette lines',
  },
  {
    id: 'caustic-sweep',
    name: 'Dynamic Caustic Glass Refraction Sweep',
    description: 'Moving prism water/glass caustics shimmering across product surfaces during motion',
  },
  {
    id: 'chiaroscuro-beam',
    name: 'Dramatic Single Beam Chiaroscuro',
    description: 'Single high-contrast volumetric light shaft cutting through cinematic shadow',
  },
  {
    id: 'catalog-daylight',
    name: '5600K Clean Balanced Catalog Daylight',
    description: 'Even three-point diffusion ensuring authentic color fidelity throughout movement',
  },
  {
    id: 'cyber-neon',
    name: 'Electric Cyan & Violet Edge Lighting',
    description: 'Dual-tone complementary neon accents creating vivid modern tech atmosphere',
  },
];

export const VIDEO_ASPECT_RATIO_OPTIONS = [
  { id: '16:9', label: '16:9 (Widescreen)', resolution: '1920 x 1080', aspectClass: 'aspect-[16/9]' },
  { id: '1:1', label: '1:1 (Square Reel)', resolution: '1080 x 1080', aspectClass: 'aspect-square' },
  { id: '9:16', label: '9:16 (Story / Reel)', resolution: '1080 x 1920', aspectClass: 'aspect-[9/16]' },
  { id: '4:5', label: '4:5 (Social Feed)', resolution: '1080 x 1350', aspectClass: 'aspect-[4/5]' },
];

export const VIDEO_QUALITY_OPTIONS = [
  { id: '1080p', label: 'Standard 1080p', details: '60 FPS • 12 Mbps H.264' },
  { id: '2k', label: 'Production 2K', details: '60 FPS • 24 Mbps H.265' },
  { id: '4k', label: 'Master 4K ProRes', details: '60 FPS • 50 Mbps ProRes HQ' },
];

import { buildTemplatePrompt } from './templateLibrary';

export const VIDEO_PROMPT_TEMPLATE =
  'Cinematic {quality} 60fps product motion reel of {product}, featuring {style} with {camera} camera movement, staged in {background}, illuminated by {lighting}, ultra-smooth continuous rotation, raytraced reflections, master studio finish';

export function buildProductVideoPrompt(params: {
  product: string;
  style: string;
  camera: string;
  background: string;
  lighting: string;
  quality: string;
}): string {
  return buildTemplatePrompt('tmpl-product-video', params);
}
