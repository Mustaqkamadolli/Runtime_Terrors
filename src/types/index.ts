export type DescriptionStyle =
  | 'quick'
  | 'detailed'
  | 'objects'
  | 'simple'
  | 'educational';

export type ProcessingMethod =
  | 'demo-intelligence'
  | 'live-ocr'
  | 'local-vlm'
  | 'unsupported';

export type SourceType =
  | 'demo-scenario'
  | 'user-upload'
  | 'camera-capture';

export type OcrDocumentType =
  | 'sign'
  | 'document'
  | 'notice'
  | 'menu'
  | 'receipt'
  | 'general';

export interface VisionResult {
  id: string;
  mode: 'describe' | 'ocr';
  title: string;
  summary: string;
  details?: string;
  visibleObjects?: string[];
  visibleText?: string;
  rawOcrText?: string;
  confidence?: number;
  limitations: string;
  sourceType: SourceType;
  processingMethod: ProcessingMethod;
  scenarioId?: string;
  createdAt: string;
  style?: DescriptionStyle;
  documentType?: OcrDocumentType;
  imagePreview?: string;
}

export interface ScenarioStyleContent {
  summary: string;
  details: string;
  objects: string[];
  limitations: string;
}

export interface Scenario {
  id: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  svgDataUri: string;
  descriptions: Record<DescriptionStyle, ScenarioStyleContent>;
  sampleOcrText: string;
  limitations: string;
  recommendedDocType?: OcrDocumentType;
}

export type TextSize = 'standard' | 'large' | 'extra-large';
export type ThemeMode = 'dark' | 'light';

export interface AccessibilitySettings {
  textSize: TextSize;
  highContrast: boolean;
  reducedMotion: boolean;
  theme: ThemeMode;
  autoSpeak: boolean;
  speechRate: number; // 0.5 to 2.0
  speechPitch: number; // 0.5 to 1.5
  speechVolume: number; // 0 to 1
  preferredVoiceURI: string;
}

export interface VisionProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  describeImage(
    imageDataUrl: string,
    style: DescriptionStyle
  ): Promise<VisionResult>;
  extractText(
    imageDataUrl: string,
    language?: string
  ): Promise<{ text: string; confidence?: number }>;
}

export type ActiveWorkspace = 'home' | 'describe' | 'ocr' | 'scenarios';
