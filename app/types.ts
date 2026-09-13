export type WorkflowCategory = 'image' | 'video';

export interface WorkflowItem {
  id: string;
  category: WorkflowCategory;
  categoryLabel: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  gradient: string;
  accentColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  aspectRatios: string[];
  defaultPrompt: string;
  estimatedTime: string;
  outputFormat: string;
  iconName: 'camera' | 'sparkles' | 'video' | 'film';
}

export interface RecentAsset {
  id: string;
  title: string;
  workflowTitle: string;
  type: 'image' | 'video';
  dimensions: string;
  duration?: string;
  timestamp: string;
  status: 'Ready' | 'Processing' | 'Completed';
  gradientBg: string;
  tag: string;
  imageUrl?: string;
  prompt?: string;
  seed?: number;
  aspectRatio?: string;
  videoGraphicUrl?: string;
  metadata?: Record<string, string | number | boolean | undefined>;
}
