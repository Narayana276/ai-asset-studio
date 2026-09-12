export interface LifestyleOptionItem {
  id: string;
  name: string;
  description: string;
  previewColor?: string;
}

export const LIFESTYLE_PRODUCT_OPTIONS: LifestyleOptionItem[] = [
  {
    id: 'lounge-chair',
    name: 'Minimalist Boucle Lounge Chair',
    description: 'Textured cream boucle upholstery with sculpted walnut wood frame',
  },
  {
    id: 'ceramic-lamp',
    name: 'Architectural Ceramic Table Lamp',
    description: 'Matte terracotta base with warm linen cylinder lampshade',
  },
  {
    id: 'speaker',
    name: 'Portable Aluminum Bluetooth Speaker',
    description: 'Brushed anodized metal casing with woven leather carry strap',
  },
  {
    id: 'pour-over',
    name: 'Handcrafted Ceramic Pour-Over Set',
    description: 'Speckled stoneware dripper resting atop ribbed borosilicate carafe',
  },
  {
    id: 'sunglasses',
    name: 'Designer Tortoise Acetate Sunglasses',
    description: 'Classic square silhouette with subtle gold temple inlays',
  },
  {
    id: 'duffle',
    name: 'Full-Grain Leather Weekender Duffle',
    description: 'Cognac oiled leather with antique brass hardware and strap',
  },
];

export const LIFESTYLE_ENVIRONMENT_OPTIONS: LifestyleOptionItem[] = [
  {
    id: 'scandi-living-room',
    name: 'Sunlit Scandinavian Living Room',
    description: 'Bleached oak hardwood, sheer linen curtains, fiddle-leaf fig tree',
    previewColor: '#e0e7ff',
  },
  {
    id: 'midcentury-penthouse',
    name: 'Luxury Mid-Century Penthouse',
    description: 'Panoramic floor-to-ceiling city skyline, polished walnut credenza',
    previewColor: '#1e1b4b',
  },
  {
    id: 'concrete-kitchen',
    name: 'Minimalist Concrete Kitchen Island',
    description: 'Honed waterfall stone counter, fluted plaster walls, warm morning light',
    previewColor: '#94a3b8',
  },
  {
    id: 'desert-patio',
    name: 'Outdoor Bohemian Desert Patio',
    description: 'Sunbaked terracotta pavers, potted cacti, distant mountain silhouettes',
    previewColor: '#f97316',
  },
  {
    id: 'wabi-sabi-study',
    name: 'Japanese Wabi-Sabi Study Room',
    description: 'Tatami floor mats, shoji screen soft diffusion, low natural wood desk',
    previewColor: '#a8a29e',
  },
];

export const LIFESTYLE_STYLE_OPTIONS: LifestyleOptionItem[] = [
  {
    id: 'architectural-digest',
    name: 'Architectural Digest Editorial',
    description: 'High-end interior design publication aesthetics with pristine balance',
  },
  {
    id: 'lived-in-organic',
    name: 'Warm Lived-in Organic',
    description: 'Casual candid staging, soft morning coffee steam, inviting natural drape',
  },
  {
    id: 'moody-cinematic',
    name: 'Moody Cinematic Luxury',
    description: 'Deep contrast falloff, rich shadows, and evocative atmospheric tones',
  },
  {
    id: 'bright-coastal',
    name: 'Bright Coastal Contemporary',
    description: 'Airy breezy ambiance, sun-bleached driftwood, and crisp cyan sky reflections',
  },
  {
    id: 'vintage-film',
    name: 'Warm 35mm Analog Film',
    description: 'Subtle film grain, nostalgic golden highlights, and soft halation',
  },
];

export const LIFESTYLE_LIGHTING_OPTIONS: LifestyleOptionItem[] = [
  {
    id: 'golden-hour-window',
    name: 'Golden Hour Window Cast',
    description: 'Warm 3200K sunset light streaming through large architectural panes',
  },
  {
    id: 'overcast-diffused',
    name: 'Soft Overcast Diffused Daylight',
    description: 'Gentle shadowless ambient light with natural interior wrapping',
  },
  {
    id: 'twilight-ambient',
    name: 'Twilight Blue Hour Ambient',
    description: 'Deep navy outdoor evening light paired with warm 2700K interior lamps',
  },
  {
    id: 'dappled-sunbeams',
    name: 'Dappled Tree Foliage Sunbeams',
    description: 'Playful organic leaf shadows dancing across the floor and product',
  },
  {
    id: 'bright-morning',
    name: 'Crisp High-Key Morning Sun',
    description: 'Energizing bright 5400K natural daylight illuminating every detail',
  },
];

export const LIFESTYLE_CAMERA_OPTIONS: LifestyleOptionItem[] = [
  {
    id: 'wide-interior',
    name: 'Wide Eye-Level Room Scene',
    description: 'Captures the full contextual interior environment and architecture',
  },
  {
    id: 'hero-shallow-dof',
    name: 'Hero 45° Shallow Depth-of-Field',
    description: 'Product sharply in focus with creamy soft environmental bokeh',
  },
  {
    id: 'low-angle-architectural',
    name: 'Low-Angle Architectural Grounding',
    description: 'Emphasizes height, spatial volume, and room proportions',
  },
  {
    id: 'macro-environmental',
    name: 'Close-Up Environmental Detail',
    description: 'Tight focus on build materials with blurred background lifestyle cues',
  },
  {
    id: 'overhead-flatlay',
    name: 'Elevated Flatlay Perspective',
    description: 'Top-down organized arrangement on natural wood or stone surface',
  },
];

export const LIFESTYLE_ASPECT_RATIO_OPTIONS = [
  { id: '4:5', label: '4:5 (Social Feed)', resolution: '1638 x 2048', aspectClass: 'aspect-[4/5]' },
  { id: '16:9', label: '16:9 (Hero Banner)', resolution: '2560 x 1440', aspectClass: 'aspect-[16/9]' },
  { id: '1:1', label: '1:1 (Square Grid)', resolution: '2048 x 2048', aspectClass: 'aspect-square' },
  { id: '9:16', label: '9:16 (Story / Reel)', resolution: '1152 x 2048', aspectClass: 'aspect-[9/16]' },
  { id: '3:2', label: '3:2 (Editorial Print)', resolution: '2160 x 1440', aspectClass: 'aspect-[3/2]' },
];

import { buildTemplatePrompt } from './templateLibrary';

export function buildLifestylePrompt(params: {
  product: string;
  environment: string;
  style: string;
  lighting: string;
  camera: string;
  aspectRatio: string;
}): string {
  return buildTemplatePrompt('tmpl-lifestyle-image', params);
}
