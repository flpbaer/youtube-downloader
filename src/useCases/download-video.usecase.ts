import fs from 'fs';
import path from 'path';
import { DownloadOptions, DownloadResult, VideoQuality } from '../types';
import { YouTubeService } from '../services/youtube.service';
import { FileUtils } from '../utils/file';
import { FormatUtils } from '../utils/format';
import { ERROR_MESSAGES } from '../config/ytdl.config';

export class DownloadVideoUseCase {
  constructor(private youtubeService: YouTubeService) {}

  async execute(options: DownloadOptions): Promise<DownloadResult> {
    try {
      console.log('\n🔍 Verificando URL...\n');

      if (!this.youtubeService.validateURL(options.url)) {
        console.error('❌ URL inválida do YouTube!');
        return { success: false, error: 'URL inválida' };
      }

      console.log('📋 Obtendo informações do vídeo...\n');

      const info = await this.youtubeService.getVideoInfo(options.url);
      this.displayVideoInfo(info);

      const downloadsDir = options.outputPath || FileUtils.getDownloadsDirectory();
      FileUtils.ensureDirectoryExists(downloadsDir);

      const filename = FormatUtils.sanitizeFilename(info.title) + '.mp4';
      const filePath = path.join(downloadsDir, filename);

      if (FileUtils.fileExists(filePath)) {
        console.log('⚠️  Arquivo já existe! Sobrescrevendo...\n');
      }

      console.log('⬇️  Iniciando download...\n');

      await this.downloadVideo(options.url, options.quality, filePath);

      console.log('\n\n✅ Download concluído!');
      console.log('📁 Arquivo salvo em:', filePath);
      console.log('');

      return { success: true, filePath };
    } catch (error: any) {
      this.handleError(error);
      return { success: false, error: error.message };
    }
  }

  private displayVideoInfo(info: { title: string; author: string; duration: number }): void {
    console.log('📹 Título:', info.title);
    console.log('👤 Autor:', info.author);
    console.log('⏱️  Duração:', FormatUtils.formatDuration(info.duration));
    console.log('');
  }

  private async downloadVideo(
    url: string,
    qualityOption: VideoQuality,
    filePath: string
  ): Promise<void> {
    const quality = this.mapQuality(qualityOption);
    const video = this.youtubeService.createDownloadStream(url, quality);
    const writeStream = fs.createWriteStream(filePath);

    let downloadedBytes = 0;
    let totalBytes = 0;
    const startTime = Date.now();

    video.on('response', (response) => {
      totalBytes = parseInt(response.headers['content-length'] || '0');
      if (totalBytes > 0) {
        console.log('📦 Tamanho total:', FormatUtils.formatBytes(totalBytes));
      }
    });

    video.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      this.displayProgress(downloadedBytes, totalBytes, startTime);
    });

    video.on('error', (err) => {
      console.error('\n❌ Erro durante download:', err.message);
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
        `\r📊 Progresso: ${percent}% | ${FormatUtils.formatBytes(downloadedBytes)} / ${FormatUtils.formatBytes(totalBytes)} | ${FormatUtils.formatBytes(speed)}/s`
      );
    } else {
      process.stdout.write(`\r📊 Baixado: ${FormatUtils.formatBytes(downloadedBytes)}`);
    }
  }

  private handleError(error: any): void {
    console.error('\n❌ Erro ao fazer download:', error.message);

    if (error.message.includes('403')) {
      ERROR_MESSAGES[403].forEach((msg) => console.error(msg));
    } else if (error.message.includes('410')) {
      ERROR_MESSAGES[410].forEach((msg) => console.error(msg));
    } else if (error.message.includes('Could not extract')) {
      ERROR_MESSAGES.extract.forEach((msg) => console.error(msg));
    }
    console.log('');
  }
}
