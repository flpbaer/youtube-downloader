import ytdl from '@distube/ytdl-core';
import { VideoInfo } from '../types';
import { YTDL_CONFIG } from '../config/ytdl.config';

export class YouTubeService {
  private agent = ytdl.createAgent();

  validateURL(url: string): boolean {
    return ytdl.validateURL(url);
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

  createDownloadStream(url: string, quality: string) {
    return ytdl(url, {
      quality: quality as any,
      filter: 'audioandvideo',
      agent: this.agent,
      requestOptions: YTDL_CONFIG.requestOptions,
    });
  }

  getAgent() {
    return this.agent;
  }
}
