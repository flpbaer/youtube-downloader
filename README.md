# 🎥 YouTube Video Downloader

YouTube video downloader built with TypeScript and clean architecture.

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## 🚀 Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

## 💻 How to use

1. Run the application:

```bash
npm start
```

Or build and run in one command:

```bash
npm run dev
```

2. Paste the YouTube video URL when prompted
3. Choose download type (video/audio) - **automatic for YouTube Music links!**
4. Choose the quality (highest/lowest/medium)
5. Wait for the download to complete

Files will be saved in the `downloads/` folder.

### 🎵 YouTube Music Support

When you paste a YouTube Music URL (contains `music.youtube.com`), the application automatically:

- Detects it's a music link
- Downloads only the audio
- Saves as MP3 format

For regular YouTube videos, you can choose:

- **video**: Downloads video+audio as MP4
- **audio**: Downloads only audio as MP3

## 🏗️ Project Structure

```
src/
├── cli/              # CLI interface
│   └── menu.ts
├── config/           # Configuration files
│   └── ytdl.config.ts
├── services/         # External services
│   └── youtube.service.ts
├── types/            # TypeScript types
│   └── index.ts
├── useCases/         # Business logic
│   └── download-video.usecase.ts
├── utils/            # Utility functions
│   ├── file.ts
│   └── format.ts
└── index.ts          # Entry point
```

## ⚙️ Features

- ✅ TypeScript for type safety
- ✅ Clean architecture with use cases
- ✅ Download YouTube videos
- ✅ Download YouTube Music as MP3 (automatic detection)
- ✅ Choose between video or audio format
- ✅ Display video information (title, author, duration)
- ✅ Progress bar during download
- ✅ Multiple quality options
- ✅ Automatic filename sanitization
- ✅ Interactive CLI interface

## �️ Technologies

- **TypeScript**: Type-safe JavaScript
- **@distube/ytdl-core**: YouTube video downloader
- **Node.js**: JavaScript runtime

## 📝 Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
- `npm run dev` - Build and run in one command
- `npm run clean` - Remove the dist folder

## ⚠️ Disclaimer

- Make sure you have permission to download content
- Some videos may have restrictions
- Respect copyright and content creators' rights
- This tool is for educational purposes only

## 🔧 Troubleshooting

### Error 403 (Forbidden)

If you receive a 403 error:

- Wait a few minutes and try again
- Try with another YouTube video
- Update the library: `npm update @distube/ytdl-core`
- Check if the video is not private

### "Could not extract functions" Error

- Run: `npm update @distube/ytdl-core`
- If it persists: `rm -rf node_modules package-lock.json && npm install`

