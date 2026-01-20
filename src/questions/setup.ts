import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs-extra';

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

const CLAUDE_FILES = {
  claudeDir: '.claude',
  claudeJson: '.claude.json',
  claudeMd: 'CLAUDE.md',
  claudeSetupMd: 'CLAUDE_SETUP.md',
};

export function checkExistingClaudeFiles(directory: string): ExistingClaudeFiles {
  return {
    hasClaudeDir: fs.existsSync(path.join(directory, CLAUDE_FILES.claudeDir)),
    hasClaudeJson: fs.existsSync(path.join(directory, CLAUDE_FILES.claudeJson)),
    hasClaudeMd: fs.existsSync(path.join(directory, CLAUDE_FILES.claudeMd)),
    hasClaudeSetupMd: fs.existsSync(path.join(directory, CLAUDE_FILES.claudeSetupMd)),
  };
}

export function hasAnyClaudeFiles(files: ExistingClaudeFiles): boolean {
  return files.hasClaudeDir || files.hasClaudeJson || files.hasClaudeMd || files.hasClaudeSetupMd;
}

export function getExistingFilesList(files: ExistingClaudeFiles): string[] {
  const list: string[] = [];
  if (files.hasClaudeDir) list.push(CLAUDE_FILES.claudeDir);
  if (files.hasClaudeJson) list.push(CLAUDE_FILES.claudeJson);
  if (files.hasClaudeMd) list.push(CLAUDE_FILES.claudeMd);
  if (files.hasClaudeSetupMd) list.push(CLAUDE_FILES.claudeSetupMd);
  return list;
}

export async function askSetupQuestions(): Promise<SetupAnswers> {
  const { directoryMode } = await inquirer.prompt<{ directoryMode: DirectoryMode }>([
    {
      type: 'list',
      name: 'directoryMode',
      message: 'Where would you like to set up Claude Code?',
      choices: [
        { name: 'Use current directory', value: 'existing' },
        { name: 'Create a new project directory', value: 'new' },
      ],
    },
  ]);

  let targetDirectory: string;

  if (directoryMode === 'new') {
    const { newDirName } = await inquirer.prompt<{ newDirName: string }>([
      {
        type: 'input',
        name: 'newDirName',
        message: 'Enter the name for the new directory:',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Directory name is required';
          }
          if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
            return 'Directory name can only contain letters, numbers, hyphens, and underscores';
          }
          const fullPath = path.join(process.cwd(), input);
          if (fs.existsSync(fullPath)) {
            return `Directory "${input}" already exists`;
          }
          return true;
        },
      },
    ]);

    targetDirectory = path.join(process.cwd(), newDirName);
    await fs.ensureDir(targetDirectory);

    return {
      directoryMode,
      targetDirectory,
    };
  }

  // Existing directory mode
  targetDirectory = process.cwd();
  const existingFiles = checkExistingClaudeFiles(targetDirectory);

  if (hasAnyClaudeFiles(existingFiles)) {
    const filesList = getExistingFilesList(existingFiles);

    const { existingFilesAction } = await inquirer.prompt<{ existingFilesAction: ExistingFilesAction }>([
      {
        type: 'list',
        name: 'existingFilesAction',
        message: `Found existing Claude files: ${filesList.join(', ')}\nHow would you like to proceed?`,
        choices: [
          {
            name: 'Merge with existing files (upsert)',
            value: 'upsert'
          },
          {
            name: 'Remove existing and create fresh',
            value: 'clean'
          },
        ],
      },
    ]);

    return {
      directoryMode,
      targetDirectory,
      existingFilesAction,
    };
  }

  return {
    directoryMode,
    targetDirectory,
  };
}

export async function cleanExistingClaudeFiles(directory: string): Promise<void> {
  const files = checkExistingClaudeFiles(directory);

  if (files.hasClaudeDir) {
    await fs.remove(path.join(directory, CLAUDE_FILES.claudeDir));
  }
  if (files.hasClaudeJson) {
    await fs.remove(path.join(directory, CLAUDE_FILES.claudeJson));
  }
  if (files.hasClaudeMd) {
    await fs.remove(path.join(directory, CLAUDE_FILES.claudeMd));
  }
  if (files.hasClaudeSetupMd) {
    await fs.remove(path.join(directory, CLAUDE_FILES.claudeSetupMd));
  }
}
