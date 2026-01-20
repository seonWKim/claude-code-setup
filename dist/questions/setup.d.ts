export type DirectoryMode = 'new' | 'existing';
export type ExistingFilesAction = 'upsert' | 'clean';
export interface SetupAnswers {
    directoryMode: DirectoryMode;
    targetDirectory: string;
    existingFilesAction?: ExistingFilesAction;
}
export interface ExistingClaudeFiles {
    hasClaudeDir: boolean;
    hasClaudeJson: boolean;
    hasClaudeMd: boolean;
    hasClaudeSetupMd: boolean;
}
export declare function checkExistingClaudeFiles(directory: string): ExistingClaudeFiles;
export declare function hasAnyClaudeFiles(files: ExistingClaudeFiles): boolean;
export declare function getExistingFilesList(files: ExistingClaudeFiles): string[];
export declare function askSetupQuestions(): Promise<SetupAnswers>;
export declare function cleanExistingClaudeFiles(directory: string): Promise<void>;
//# sourceMappingURL=setup.d.ts.map