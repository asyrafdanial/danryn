export interface LoveNote {
  id: string;
  content: string;
  date: string;
  color: string; // Background color for sticky note effect
}

export interface GalleryImage {
  id: string;
  dataUrl: string; // Base64 string
  caption: string;
  date: string;
}

export type ViewState = 'home' | 'gallery' | 'notes' | 'upload';

export interface IconProps {
  className?: string;
  size?: number;
  onClick?: () => void;
}