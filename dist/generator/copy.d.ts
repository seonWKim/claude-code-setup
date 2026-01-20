import type { SelectedComponents } from '../types/index.js';
export declare function copySelectedFiles(sourceDir: string, targetDir: string, components: SelectedComponents): Promise<void>;
export declare function writeClaudeJson(targetDir: string, components: SelectedComponents, upsertMode?: boolean): Promise<void>;
export declare function writeSettingsLocal(targetDir: string, components: SelectedComponents, enableHooks: boolean, upsertMode?: boolean): Promise<void>;
//# sourceMappingURL=copy.d.ts.map