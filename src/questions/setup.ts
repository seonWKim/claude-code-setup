import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs-extra';
import { askWithGoBack, GoBackError, GO_BACK_CHOICE } from '../utils/wizard.js';

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
  const questionKeys = ['directoryMode', 'newDirName', 'existingFilesAction'];
  let currentIndex = 0;
  const answers: {
    directoryMode?: DirectoryMode;
    newDirName?: string;
    existingFilesAction?: ExistingFilesAction;
  } = {};

  while (currentIndex < questionKeys.length) {
    const questionKey = questionKeys[currentIndex];
    const isFirst = currentIndex === 0;

    try {
      switch (questionKey) {
        case 'directoryMode': {
          answers.directoryMode = await askWithGoBack<DirectoryMode>({
            type: 'list',
            name: 'directoryMode',
            message: 'Where would you like to set up Claude Code?',
            choices: [
              { name: 'Use current directory', value: 'existing' },
              { name: 'Create a new project directory', value: 'new' },
            ],
          }, isFirst);
          break;
        }

        case 'newDirName': {
          // Skip if not creating new directory
          if (answers.directoryMode !== 'new') {
            currentIndex++;
            continue;
          }

          answers.newDirName = await askWithGoBack<string>({
            type: 'input',
            name: 'newDirName',
            message: 'Enter the name for the new directory:',
            validate: (input: string) => {
              if (input.toLowerCase() === 'back') return true;
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
          }, false);
          break;
        }

        case 'existingFilesAction': {
          // Skip if creating new directory
          if (answers.directoryMode === 'new') {
            currentIndex++;
            continue;
          }

          const existingFiles = checkExistingClaudeFiles(process.cwd());
          if (!hasAnyClaudeFiles(existingFiles)) {
            currentIndex++;
            continue;
          }

          const filesList = getExistingFilesList(existingFiles);
          answers.existingFilesAction = await askWithGoBack<ExistingFilesAction>({
            type: 'list',
            name: 'existingFilesAction',
            message: `Found existing Claude files: ${filesList.join(', ')}\nHow would you like to proceed?`,
            choices: [
              { name: 'Merge with existing files (upsert)', value: 'upsert' },
              { name: 'Remove existing and create fresh', value: 'clean' },
            ],
          }, false);
          break;
        }
      }

      currentIndex++;
    } catch (error) {
      if (error instanceof GoBackError) {
        if (currentIndex > 0) {
          currentIndex--;
          // Handle skipped questions when going back
          if (questionKeys[currentIndex] === 'newDirName' && answers.directoryMode !== 'new') {
            currentIndex--;
          }
          if (questionKeys[currentIndex] === 'existingFilesAction' && answers.directoryMode === 'new') {
            currentIndex--;
          }
        }
        // If at first question, just restart it
      } else {
        throw error;
      }
    }
  }

  // Build the result
  let targetDirectory: string;
  if (answers.directoryMode === 'new' && answers.newDirName) {
    targetDirectory = path.join(process.cwd(), answers.newDirName);
    await fs.ensureDir(targetDirectory);
  } else {
    targetDirectory = process.cwd();
  }

  return {
    directoryMode: answers.directoryMode!,
    targetDirectory,
    existingFilesAction: answers.existingFilesAction,
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
