
export enum AppStatus {
  IDLE = 'IDLE',
  LOADED = 'LOADED',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR'
}

export enum FileStatus {
  QUEUED = 'QUEUED',
  CONVERTING = 'CONVERTING',
  CONVERTED = 'CONVERTED',
  ERROR = 'ERROR',
}

export enum ConversionType {
  PNG_TO_SVG = 'PNG_TO_SVG',
  SVG_TO_PNG = 'SVG_TO_PNG'
}

export interface ConversionFile {
  id: string;
  file: File;
  status: FileStatus;
  previewUrl: string;
  width: number;
  height: number;
  outputPreviewUrl: string | null;
  conversionType: ConversionType;
  error: string | null;
}
