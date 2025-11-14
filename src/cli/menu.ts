import readline from 'readline';
import { VideoQuality } from '../types';
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
    this.rl.question('📎 Cole a URL do vídeo do YouTube: ', (url) => {
      if (!url || url.trim() === '') {
        console.log('❌ URL não fornecida!');
        this.rl.close();
        return;
      }

      this.askForQuality(url.trim());
    });
  }

  private askForQuality(url: string): void {
    this.rl.question(
      '\n🎯 Escolha a qualidade (highest/lowest/medium) [highest]: ',
      async (quality) => {
        const selectedQuality = (quality.trim() || 'highest') as VideoQuality;

        await this.downloadVideoUseCase.execute({
          url,
          quality: selectedQuality,
        });

        this.askForAnotherDownload();
      }
    );
  }

  private askForAnotherDownload(): void {
    this.rl.question('\n🔄 Deseja baixar outro vídeo? (s/n): ', (answer) => {
      if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'sim') {
        this.show();
      } else {
        console.log('\n👋 Até logo!\n');
        this.rl.close();
      }
    });
  }
}
