export type VideoQuality = 'highest' | 'lowest' | 'medium';

export interface VideoInfo {
  title: string;
  author: string;
  duration: number;
}

export interface DownloadProgress {
  downloadedBytes: number;
  totalBytes: number;
  percentage: number;
  speed: number;
}

export interface DownloadOptions {
  url: string;
  quality: VideoQuality;
  outputPath?: string;
}

export interface DownloadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}
