import { cloneSourceRepo, cleanupTempDir } from './clone.js';
import {
  copySelectedFiles,
  writeClaudeJson,
  writeSettingsLocal,
} from './copy.js';
import { generateClaudeMd } from './claude-md.js';
import { generateSetupMd } from './setup-md.js';
import type { UserAnswers, SelectedComponents } from '../types/index.js';
import logger from '../utils/logger.js';

export async function generateConfiguration(
  targetDir: string,
  answers: UserAnswers,
  components: SelectedComponents
): Promise<void> {
  let sourceDir: string | null = null;

  try {
    logger.newline();
    logger.title('Generating Configuration...');
    logger.newline();

    // Clone the source repository
    sourceDir = await cloneSourceRepo();

    // Copy selected files
    await copySelectedFiles(sourceDir, targetDir, components);

    // Generate configuration files
    await writeClaudeJson(targetDir, components);
    await writeSettingsLocal(targetDir, components, answers.enableHooks);

    // Generate documentation
    await generateClaudeMd(targetDir, answers, components);
    await generateSetupMd(targetDir, answers, components);
  } finally {
    // Always cleanup temp directory
    await cleanupTempDir();
  }
}

export {
  cloneSourceRepo,
  cleanupTempDir,
  copySelectedFiles,
  writeClaudeJson,
  writeSettingsLocal,
  generateClaudeMd,
  generateSetupMd,
};
