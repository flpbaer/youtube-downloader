import readline from 'readline';
import { VideoQuality, DownloadType } from '../types';
import { DownloadVideoUseCase } from '../useCases/download-video.usecase';

export class Menu {
  private rl: readline.Interface;

  constructor(private downloadVideoUseCase: DownloadVideoUseCase) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  show(): void {
    console.log('\n════════════════════════════════════════');
    console.log('🎥  YouTube Video Downloader');
    console.log('════════════════════════════════════════\n');

    this.askForURL();
  }

  private askForURL(): void {
    this.rl.question('📎 Paste the YouTube video URL: ', (url) => {
      if (!url || url.trim() === '') {
        console.log('❌ URL not provided!');
        this.rl.close();
        return;
      }

      const trimmedUrl = url.trim();
      
      // Detect if it's YouTube Music IMMEDIATELY
      const isMusic = trimmedUrl.includes('music.youtube.com');
      
      if (isMusic) {
        console.log('\n═══════════════════════════════════════════════════════');
        console.log('🎵 YOUTUBE MUSIC DETECTED!');
        console.log('═══════════════════════════════════════════════════════');
        console.log('📥 Automatic download in MP3 format');
        console.log('═══════════════════════════════════════════════════════');
        this.askForQuality(trimmedUrl, 'audio');
      } else {
        this.askForDownloadType(trimmedUrl);
      }
    });
  }

  private askForDownloadType(url: string): void {
    this.rl.question(
      '\n🎬 Download as (video/audio) [video]: ',
      (type) => {
        const downloadType = (type.trim().toLowerCase() || 'video') as DownloadType;
        
        if (downloadType !== 'video' && downloadType !== 'audio') {
          console.log('⚠️  Invalid option, using "video"');
          this.askForQuality(url, 'video');
        } else {
          this.askForQuality(url, downloadType);
        }
      }
    );
  }

  private askForQuality(url: string, downloadType: DownloadType): void {
    this.rl.question(
      '\n🎯 Choose quality (highest/lowest/medium) [highest]: ',
      async (quality) => {
        const selectedQuality = (quality.trim() || 'highest') as VideoQuality;

        await this.downloadVideoUseCase.execute({
          url,
          quality: selectedQuality,
          downloadType,
        });

        this.askForAnotherDownload();
      }
    );
  }

  private askForAnotherDownload(): void {
    this.rl.question('\n🔄 Download another video? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        this.show();
      } else {
        console.log('\n👋 Goodbye!\n');
        this.rl.close();
      }
    });
  }
}
