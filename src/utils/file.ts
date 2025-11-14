import fs from 'fs';
import path from 'path';

export class FileUtils {
  static ensureDirectoryExists(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  static getDownloadsDirectory(): string {
    return path.join(process.cwd(), 'downloads');
  }
}
