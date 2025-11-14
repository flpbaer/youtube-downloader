import ytdl from '@distube/ytdl-core';
import { VideoInfo } from '../types';
import { YTDL_CONFIG } from '../config/ytdl.config';

export class YouTubeService {
  private agent = ytdl.createAgent();

  validateURL(url: string): boolean {
    return ytdl.validateURL(url);
  }

  isYouTubeMusic(url: string): boolean {
    return url.includes('music.youtube.com');
  }

  async getVideoInfo(url: string): Promise<VideoInfo> {
    const info = await ytdl.getInfo(url, {
      agent: this.agent,
      requestOptions: YTDL_CONFIG.requestOptions,
    });

    return {
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      duration: parseInt(info.videoDetails.lengthSeconds),
    };
  }

  createDownloadStream(url: string, quality: string, audioOnly: boolean = false) {
    return ytdl(url, {
      quality: audioOnly ? 'highestaudio' : (quality as any),
      filter: audioOnly ? 'audioonly' : 'audioandvideo',
      agent: this.agent,
      requestOptions: YTDL_CONFIG.requestOptions,
    });
  }

  getAgent() {
    return this.agent;
  }
}
