import { YouTubeService } from './services/youtube.service';
import { DownloadVideoUseCase } from './useCases/download-video.usecase';
import { Menu } from './cli/menu';

function main() {
  console.clear();

  const youtubeService = new YouTubeService();
  const downloadVideoUseCase = new DownloadVideoUseCase(youtubeService);
  const menu = new Menu(downloadVideoUseCase);

  menu.show();
}

main();
