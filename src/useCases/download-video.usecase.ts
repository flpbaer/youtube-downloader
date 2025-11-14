import fs from 'fs';
import path from 'path';
import { DownloadOptions, DownloadResult, VideoQuality, DownloadType } from '../types';
import { YouTubeService } from '../services/youtube.service';
import { FileUtils } from '../utils/file';
import { FormatUtils } from '../utils/format';
import { ERROR_MESSAGES } from '../config/ytdl.config';

export class DownloadVideoUseCase {
  constructor(private youtubeService: YouTubeService) {}

  async execute(options: DownloadOptions): Promise<DownloadResult> {
    try {
      console.log('\n🔍 Validating URL...\n');

      if (!this.youtubeService.validateURL(options.url)) {
        console.error('❌ Invalid YouTube URL!');
        return { success: false, error: 'Invalid URL' };
      }

      const isMusic = this.youtubeService.isYouTubeMusic(options.url);
      const downloadType: DownloadType = options.downloadType || (isMusic ? 'audio' : 'video');

      console.log('📋 Getting information...\n');

      const info = await this.youtubeService.getVideoInfo(options.url);
      this.displayVideoInfo(info, downloadType);

      const downloadsDir = options.outputPath || FileUtils.getDownloadsDirectory();
      FileUtils.ensureDirectoryExists(downloadsDir);

      const extension = downloadType === 'audio' ? '.mp3' : '.mp4';
      const filename = FormatUtils.sanitizeFilename(info.title) + extension;
      const filePath = path.join(downloadsDir, filename);

      if (FileUtils.fileExists(filePath)) {
        console.log('⚠️  File already exists! Overwriting...\n');
      }

      console.log('⬇️  Starting download...\n');

      await this.downloadVideo(options.url, options.quality, filePath, downloadType);

      console.log('\n\n✅ Download completed!');
      console.log('📁 File saved at:', filePath);
      console.log('');

      return { success: true, filePath };
    } catch (error: any) {
      this.handleError(error, options.url);
      return { success: false, error: error.message };
    }
  }

  private displayVideoInfo(
    info: { title: string; author: string; duration: number },
    downloadType: DownloadType
  ): void {
    const icon = downloadType === 'audio' ? '🎵' : '📹';
    const type = downloadType === 'audio' ? 'Music' : 'Video';
    console.log(`${icon} Title:`, info.title);
    console.log('👤 Author:', info.author);
    console.log('⏱️  Duration:', FormatUtils.formatDuration(info.duration));
    console.log('📦 Type:', type);
    console.log('');
  }

  private async downloadVideo(
    url: string,
    qualityOption: VideoQuality,
    filePath: string,
    downloadType: DownloadType = 'video'
  ): Promise<void> {
    const quality = this.mapQuality(qualityOption);
    const isAudioOnly = downloadType === 'audio';
    const video = this.youtubeService.createDownloadStream(url, quality, isAudioOnly);
    const writeStream = fs.createWriteStream(filePath);

    let downloadedBytes = 0;
    let totalBytes = 0;
    const startTime = Date.now();

    video.on('response', (response) => {
      totalBytes = parseInt(response.headers['content-length'] || '0');
      if (totalBytes > 0) {
        console.log('📦 Total size:', FormatUtils.formatBytes(totalBytes));
      }
    });

    video.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      this.displayProgress(downloadedBytes, totalBytes, startTime);
    });

    video.on('error', (err) => {
      console.error('\n❌ Error during download:', err.message);
      writeStream.close();
    });

    video.pipe(writeStream);

    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      video.on('error', reject);
    });
  }

  private mapQuality(quality: VideoQuality): string {
    const qualityMap: Record<VideoQuality, string> = {
      highest: 'highestvideo',
      lowest: 'lowestvideo',
      medium: 'highest',
    };
    return qualityMap[quality] || 'highest';
  }

  private displayProgress(downloadedBytes: number, totalBytes: number, startTime: number): void {
    if (totalBytes > 0) {
      const percent = ((downloadedBytes / totalBytes) * 100).toFixed(2);
      const elapsed = (Date.now() - startTime) / 1000;
      const speed = downloadedBytes / elapsed;
      process.stdout.write(
        `\r📊 Progress: ${percent}% | ${FormatUtils.formatBytes(downloadedBytes)} / ${FormatUtils.formatBytes(totalBytes)} | ${FormatUtils.formatBytes(speed)}/s`
      );
    } else {
      process.stdout.write(`\r📊 Downloaded: ${FormatUtils.formatBytes(downloadedBytes)}`);
    }
  }

  private handleError(error: any, url?: string): void {
    console.error('\n❌ Error downloading:', error.message);

    if (error.message.includes('403')) {
      // Check if it's YouTube Music for specific message
      if (url && this.youtubeService.isYouTubeMusic(url)) {
        ERROR_MESSAGES['403_music'].forEach((msg: string) => console.error(msg));
      } else {
        ERROR_MESSAGES['403'].forEach((msg: string) => console.error(msg));
      }
    } else if (error.message.includes('410')) {
      ERROR_MESSAGES['410'].forEach((msg: string) => console.error(msg));
    } else if (error.message.includes('Could not extract')) {
      ERROR_MESSAGES['extract'].forEach((msg: string) => console.error(msg));
    }
    console.log('');
  }
}
