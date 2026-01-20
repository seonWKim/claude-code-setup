import { cloneSourceRepo, cleanupTempDir } from './clone.js';
import {
  copySelectedFiles,
  writeClaudeJson,
  writeSettingsLocal,
} from './copy.js';
import { generateClaudeMd } from './claude-md.js';
import { generateSetupMd } from './setup-md.js';
import type { UserAnswers, SelectedComponents, ExistingFilesAction } from '../types/index.js';
import logger from '../utils/logger.js';

export interface GenerateOptions {
  existingFilesAction?: ExistingFilesAction;
}

export async function generateConfiguration(
  targetDir: string,
  answers: UserAnswers,
  components: SelectedComponents,
  options: GenerateOptions = {}
): Promise<void> {
  let sourceDir: string | null = null;
  const upsertMode = options.existingFilesAction === 'upsert';

  try {
    logger.newline();
    logger.title('Generating Configuration...');
    if (upsertMode) {
      logger.info('Mode: Merging with existing files');
    }
    logger.newline();

    // Clone the source repository
    sourceDir = await cloneSourceRepo();

    // Copy selected files
    await copySelectedFiles(sourceDir, targetDir, components);

    // Generate configuration files
    await writeClaudeJson(targetDir, components, upsertMode);
    await writeSettingsLocal(targetDir, components, answers.enableHooks, upsertMode);

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
