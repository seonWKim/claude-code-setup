import simpleGit from 'simple-git';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import spinner from '../utils/spinner.js';

const REPO_URL = 'https://github.com/affaan-m/everything-claude-code';
const TEMP_DIR_PREFIX = 'claude-code-setup-';

let tempDir: string | null = null;

export async function cloneSourceRepo(): Promise<string> {
  // Create temp directory
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), TEMP_DIR_PREFIX));

  spinner.start('Downloading configurations from GitHub...');

  try {
    const git = simpleGit();
    await git.clone(REPO_URL, tempDir, ['--depth', '1']);
    spinner.succeed('Downloaded configurations');
    return tempDir;
  } catch (error) {
    spinner.fail('Failed to download configurations');
    throw error;
  }
}

export async function cleanupTempDir(): Promise<void> {
  if (tempDir && (await fs.pathExists(tempDir))) {
    await fs.remove(tempDir);
    tempDir = null;
  }
}

export function getTempDir(): string | null {
  return tempDir;
}
