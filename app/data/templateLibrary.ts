export interface TemplateVariable {
  key: string;
  label: string;
  description: string;
  defaultValue: string;
}

export interface PromptTemplateItem {
  id: string;
  name: string;
  workflowId: 'product-image' | 'lifestyle-image' | 'product-video' | 'fashion-video';
  type: 'image' | 'video';
  description: string;
  promptTemplate: string;
  variables: TemplateVariable[];
  defaultValues: Record<string, string>;
  categoryLabel: string;
  tags: string[];
}

export const PROMPT_TEMPLATES: PromptTemplateItem[] = [
  {
    id: 'tmpl-product-image',
    name: 'E-Commerce Studio Packshot Template',
    workflowId: 'product-image',
    type: 'image',
    categoryLabel: 'IMAGE WORKFLOW',
    description:
      'Engineered for razor-sharp catalog listings with isolated studio pedestals, controlled specular rim lighting, and photorealistic contact shadows.',
    promptTemplate:
      'Studio hero commercial shot of {product}, in {style} style, placed against {background}, illuminated by {lighting}, ultra-sharp focus, master composition, 8k uhd, photorealistic texture rendering',
    variables: [
      { key: 'product', label: 'Product Subject', description: 'The primary product to be generated', defaultValue: 'Minimalist Glass Perfume Bottle' },
      { key: 'style', label: 'Visual Style', description: 'Stylistic aesthetic grading', defaultValue: 'Ultra-Clean Commercial Studio' },
      { key: 'background', label: 'Background & Surface', description: 'Studio backdrop or pedestal', defaultValue: 'Pure White Seamless Infinity Cyc (#FFFFFF)' },
      { key: 'lighting', label: 'Lighting Model', description: 'Studio lighting setup', defaultValue: 'Softbox Diffused Rim & Key Lighting' },
    ],
    defaultValues: {
      product: 'Minimalist Glass Perfume Bottle',
      style: 'Ultra-Clean Commercial Studio',
      background: 'Pure White Seamless Infinity Cyc (#FFFFFF)',
      lighting: 'Softbox Diffused Rim & Key Lighting',
    },
    tags: ['E-Commerce', 'Packshot', 'Studio Lighting', 'Isolated Cutout'],
  },
  {
    id: 'tmpl-lifestyle-image',
    name: 'Contextual Architectural Lifestyle Template',
    workflowId: 'lifestyle-image',
    type: 'image',
    categoryLabel: 'IMAGE WORKFLOW',
    description:
      'Synthesizes lived-in architectural spaces with natural daylight bleeding, room perspective alignment, and organic interior staging.',
    promptTemplate:
      'Editorial lifestyle scene featuring {product} seamlessly integrated into a {environment}, captured in {style} style, illuminated by {lighting}, with a {camera} composition, ultra-realistic textures, natural perspective, {aspectRatio} format, 8k uhd',
    variables: [
      { key: 'product', label: 'Product Subject', description: 'The lifestyle product item', defaultValue: 'Minimalist Boucle Lounge Chair' },
      { key: 'environment', label: 'Environment & Space', description: 'Architectural interior or exterior room', defaultValue: 'Sunlit Scandinavian Living Room' },
      { key: 'style', label: 'Lifestyle Style', description: 'Editorial aesthetic mood', defaultValue: 'Architectural Digest Editorial' },
      { key: 'lighting', label: 'Natural Lighting', description: 'Daylight or ambient illumination', defaultValue: 'Golden Hour Window Cast' },
      { key: 'camera', label: 'Camera / Framing', description: 'Spatial lens angle', defaultValue: 'Wide Eye-Level Room Scene' },
      { key: 'aspectRatio', label: 'Aspect Ratio', description: 'Composition framing', defaultValue: '4:5' },
    ],
    defaultValues: {
      product: 'Minimalist Boucle Lounge Chair',
      environment: 'Sunlit Scandinavian Living Room',
      style: 'Architectural Digest Editorial',
      lighting: 'Golden Hour Window Cast',
      camera: 'Wide Eye-Level Room Scene',
      aspectRatio: '4:5',
    },
    tags: ['Interior Design', 'Editorial', 'Ambient Light', 'Scene Synthesis'],
  },
  {
    id: 'tmpl-product-video',
    name: 'Cinematic 360° Product Motion Template',
    workflowId: 'product-video',
    type: 'video',
    categoryLabel: 'VIDEO WORKFLOW',
    description:
      'Continuous 60 FPS motion trajectory generator for orbital reels, lighting sweeps, and material highlights with zero temporal jitter.',
    promptTemplate:
      'Cinematic {quality} 60fps product motion reel of {product}, featuring {style} with {camera} camera movement, staged in {background}, illuminated by {lighting}, ultra-smooth continuous rotation, raytraced reflections, master studio finish',
    variables: [
      { key: 'quality', label: 'Resolution & Tier', description: 'Target quality tier and framerate', defaultValue: 'Production 2K' },
      { key: 'product', label: 'Product Subject', description: '3D subject undergoing motion', defaultValue: 'Luxury Ceramic Chronometer Watch' },
      { key: 'style', label: 'Video Style', description: 'Motion dynamics and flow', defaultValue: '360° Cinematic Orbital Spin' },
      { key: 'camera', label: 'Camera Movement', description: 'Arc, dolly, or crane track', defaultValue: 'Smooth 360° Continuous Orbit' },
      { key: 'background', label: 'Stage Environment', description: 'Studio background and floor', defaultValue: 'Dark Obsidian Studio with Pedestal' },
      { key: 'lighting', label: 'Lighting Animation', description: 'Dynamic lighting shifts and glints', defaultValue: 'Continuous Studio Key & Rim Light' },
    ],
    defaultValues: {
      quality: 'Production 2K',
      product: 'Luxury Ceramic Chronometer Watch',
      style: '360° Cinematic Orbital Spin',
      camera: 'Smooth 360° Continuous Orbit',
      background: 'Dark Obsidian Studio with Pedestal',
      lighting: 'Continuous Studio Key & Rim Light',
    },
    tags: ['60 FPS', '360 Orbital', 'Cinematic Dolly', 'Looping Reel'],
  },
  {
    id: 'tmpl-fashion-video',
    name: '4-Second Fashion Runway Micro-Reel Template',
    workflowId: 'fashion-video',
    type: 'video',
    categoryLabel: 'VIDEO WORKFLOW (EXACTLY 4 SECONDS)',
    description:
      'High-velocity 4-second motion sequence optimized for mobile social feeds, capturing fabric physics, garment flow, and runway model strides.',
    promptTemplate:
      'Dynamic 4-second mobile runway fashion video of {model} showcasing {product}, in {style} aesthetic, staged in {background}, captured with {camera} motion, illuminated by {lighting}, natural fabric drape physics, fluid motion, mobile 9:16 vertical format, 60fps cinematic quality',
    variables: [
      { key: 'product', label: 'Apparel / Garment', description: 'Fashion item worn or presented', defaultValue: 'Silk Evening Trench Coat' },
      { key: 'model', label: 'Model & Cadence', description: 'Presentation movement style', defaultValue: 'Confident Striding Runway Model' },
      { key: 'style', label: 'Fashion Style', description: 'Editorial fashion aesthetic', defaultValue: 'Haute Couture Paris Runway' },
      { key: 'background', label: 'Runway Setting', description: 'Stage or environment backdrop', defaultValue: 'Paris Runway Spotlight Catwalk' },
      { key: 'camera', label: 'Camera Track', description: 'Fast-paced mobile camera move', defaultValue: 'Smooth Low-Angle Tracking Dolly' },
      { key: 'lighting', label: 'Fashion Lighting', description: 'Dramatic runway lighting model', defaultValue: 'High-Contrast Catwalk Spotlights' },
    ],
    defaultValues: {
      product: 'Silk Evening Trench Coat',
      model: 'Confident Striding Runway Model',
      style: 'Haute Couture Paris Runway',
      background: 'Paris Runway Spotlight Catwalk',
      camera: 'Smooth Low-Angle Tracking Dolly',
      lighting: 'High-Contrast Catwalk Spotlights',
    },
    tags: ['Exactly 4s', '9:16 Vertical', 'Fabric Physics', 'Runway Strut'],
  },
];

export function buildTemplatePrompt(
  templateId: string,
  values: Record<string, string>
): string {
  const template = PROMPT_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return '';

  let prompt = template.promptTemplate;
  for (const [key, val] of Object.entries(values)) {
    prompt = prompt.replaceAll(`{${key}}`, val);
  }
  return prompt;
}
