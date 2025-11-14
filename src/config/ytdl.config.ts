export const YTDL_CONFIG = {
  requestOptions: {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  },
};

export const ERROR_MESSAGES: Record<string, string[]> = {
  '403': [
    '💡 Tips to solve 403 error:',
    '   1. Wait a few minutes and try again',
    '   2. Try with another YouTube video',
    '   3. Check if the video is not private or restricted',
    '   4. YouTube may be temporarily limiting requests',
  ],
  '403_music': [
    '💡 Error 403 - YouTube Music:',
    '   ⚠️  Many YouTube Music songs have download protection',
    '   ✅ Try using a regular YouTube video instead of YouTube Music',
    '   ✅ Search for the same song on regular YouTube (youtube.com) and download as audio',
    '   💡 Tip: Copy the song name and search on regular YouTube',
  ],
  '410': ['💡 Tip: This video may be restricted or has been removed.'],
  'extract': [
    '💡 Tip: Error extracting video information.',
    '   Try updating the library: npm update @distube/ytdl-core',
  ],
};
