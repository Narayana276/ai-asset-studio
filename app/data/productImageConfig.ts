export interface OptionItem {
  id: string;
  name: string;
  description: string;
  icon?: string;
  previewColor?: string;
}

export const PRODUCT_OPTIONS: OptionItem[] = [
  {
    id: 'jacket',
    name: 'Black Leather Jacket',
    description: 'Premium black leather jacket with sleek tailoring and subtle sheen',
  },
  {
    id: 'watch',
    name: 'Luxury Ceramic Chronometer Watch',
    description: 'Deep obsidian ceramic bezel with brushed titanium accents',
  },
  {
    id: 'headphones',
    name: 'Wireless Studio Over-Ear Headphones',
    description: 'Matte aluminum earcups with plush memory-foam cushions',
  },
  {
    id: 'sneakers',
    name: 'Performance Running Sneaker',
    description: 'Breathable engineered mesh with sculpted nitrogen-infused midsole',
  },
  {
    id: 'serum',
    name: 'Organic Botanical Serum Dropper',
    description: 'Emerald green apothecary glass bottle with calibrated pipette',
  },
  {
    id: 'tumbler',
    name: 'Matte Ceramic Coffee Tumbler',
    description: 'Double-walled stoneware tumbler with terracotta silicone lid',
  },
];

export const STYLE_OPTIONS: OptionItem[] = [
  {
    id: 'commercial',
    name: 'Ultra-Clean Commercial Studio',
    description: 'Pristine, razor-sharp e-commerce catalog presentation',
  },
  {
    id: 'editorial',
    name: 'Luxury Editorial & Vogue Style',
    description: 'High-fashion aesthetic with moody depth and sophisticated grading',
  },
  {
    id: 'minimalist',
    name: 'Scandinavian Warm Minimalist',
    description: 'Simple geometric forms, organic tones, and tranquil balance',
  },
  {
    id: 'cyberpunk',
    name: 'High-Tech Dark Cyberpunk',
    description: 'Sleek industrial sheen with subtle chromatic aberration and edge accents',
  },
  {
    id: 'botanical',
    name: 'Natural Organic Botanical',
    description: 'Surrounded by botanical foliage, organic moss, and earthy elements',
  },
];

export const BACKGROUND_OPTIONS: OptionItem[] = [
  {
    id: 'pure-white',
    name: 'Pure White Seamless Infinity Cyc (#FFFFFF)',
    description: 'Flawless clean cutout with natural contact shadow for Amazon & Shopify',
    previewColor: '#FFFFFF',
  },
  {
    id: 'carrara-marble',
    name: 'Honed Carrara Marble Slab Pedestal',
    description: 'Grey-veined white Italian marble with subtle natural reflections',
    previewColor: '#E2E8F0',
  },
  {
    id: 'obsidian-slate',
    name: 'Matte Obsidian Slate Podium',
    description: 'Textured dark slate stone with micro-mineral glints',
    previewColor: '#1E293B',
  },
  {
    id: 'warm-beige',
    name: 'Warm Beige Architectural Geometry',
    description: 'Curved plaster arches and warm travertine stone steps',
    previewColor: '#D4B996',
  },
  {
    id: 'alpha-transparent',
    name: 'Transparent PNG / Alpha Cutout',
    description: 'Pre-isolated background with intact alpha opacity channel',
    previewColor: '#334155',
  },
];

export const LIGHTING_OPTIONS: OptionItem[] = [
  {
    id: 'softbox-rim',
    name: 'Softbox Diffused Rim & Key Lighting',
    description: 'Soft wrap-around studio light eliminating harsh hot spots',
  },
  {
    id: 'chiaroscuro',
    name: 'Dramatic High-Contrast Chiaroscuro',
    description: 'Deep cinematic falloff shadows with single powerful key beam',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour Directional Sun Bleed',
    description: 'Warm 3200K low-angle sunlight casting elongated window shadows',
  },
  {
    id: 'clean-ecommerce',
    name: 'Even 3-Point E-Commerce Balance',
    description: 'Neutral 5600K daylight balanced across all product facets',
  },
  {
    id: 'caustic-specular',
    name: 'Caustic Glass & Prism Specular Highlights',
    description: 'Intricate refractive water/glass light ribbons across surfaces',
  },
];

export const ASPECT_RATIO_OPTIONS = [
  { id: '1:1', label: '1:1 (Square)', resolution: '2048 x 2048', aspectClass: 'aspect-square' },
  { id: '4:5', label: '4:5 (Social Portrait)', resolution: '1638 x 2048', aspectClass: 'aspect-[4/5]' },
  { id: '16:9', label: '16:9 (Hero Banner)', resolution: '2560 x 1440', aspectClass: 'aspect-[16/9]' },
  { id: '9:16', label: '9:16 (Story / Reel)', resolution: '1152 x 2048', aspectClass: 'aspect-[9/16]' },
  { id: '3:4', label: '3:4 (Catalog)', resolution: '1536 x 2048', aspectClass: 'aspect-[3/4]' },
];

import { buildTemplatePrompt } from './templateLibrary';

export function buildProductPrompt(params: {
  product: string;
  style: string;
  background: string;
  lighting: string;
}): string {
  return buildTemplatePrompt('tmpl-product-image', params);
}
