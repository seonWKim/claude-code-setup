import { cloneSourceRepo, cleanupTempDir } from './clone.js';
import { copySelectedFiles, writeClaudeJson, writeSettingsLocal } from './copy.js';
import { generateClaudeMd } from './claude-md.js';
import { generateSetupMd } from './setup-md.js';
import type { UserAnswers, SelectedComponents } from '../types/index.js';
export declare function generateConfiguration(targetDir: string, answers: UserAnswers, components: SelectedComponents): Promise<void>;
export { cloneSourceRepo, cleanupTempDir, copySelectedFiles, writeClaudeJson, writeSettingsLocal, generateClaudeMd, generateSetupMd, };
//# sourceMappingURL=index.d.ts.map