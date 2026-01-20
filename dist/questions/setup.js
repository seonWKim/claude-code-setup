"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExistingClaudeFiles = checkExistingClaudeFiles;
exports.hasAnyClaudeFiles = hasAnyClaudeFiles;
exports.getExistingFilesList = getExistingFilesList;
exports.askSetupQuestions = askSetupQuestions;
exports.cleanExistingClaudeFiles = cleanExistingClaudeFiles;
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const CLAUDE_FILES = {
    claudeDir: '.claude',
    claudeJson: '.claude.json',
    claudeMd: 'CLAUDE.md',
    claudeSetupMd: 'CLAUDE_SETUP.md',
};
function checkExistingClaudeFiles(directory) {
    return {
        hasClaudeDir: fs_extra_1.default.existsSync(path_1.default.join(directory, CLAUDE_FILES.claudeDir)),
        hasClaudeJson: fs_extra_1.default.existsSync(path_1.default.join(directory, CLAUDE_FILES.claudeJson)),
        hasClaudeMd: fs_extra_1.default.existsSync(path_1.default.join(directory, CLAUDE_FILES.claudeMd)),
        hasClaudeSetupMd: fs_extra_1.default.existsSync(path_1.default.join(directory, CLAUDE_FILES.claudeSetupMd)),
    };
}
function hasAnyClaudeFiles(files) {
    return files.hasClaudeDir || files.hasClaudeJson || files.hasClaudeMd || files.hasClaudeSetupMd;
}
function getExistingFilesList(files) {
    const list = [];
    if (files.hasClaudeDir)
        list.push(CLAUDE_FILES.claudeDir);
    if (files.hasClaudeJson)
        list.push(CLAUDE_FILES.claudeJson);
    if (files.hasClaudeMd)
        list.push(CLAUDE_FILES.claudeMd);
    if (files.hasClaudeSetupMd)
        list.push(CLAUDE_FILES.claudeSetupMd);
    return list;
}
async function askSetupQuestions() {
    const { directoryMode } = await inquirer_1.default.prompt([
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
    let targetDirectory;
    if (directoryMode === 'new') {
        const { newDirName } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'newDirName',
                message: 'Enter the name for the new directory:',
                validate: (input) => {
                    if (!input.trim()) {
                        return 'Directory name is required';
                    }
                    if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
                        return 'Directory name can only contain letters, numbers, hyphens, and underscores';
                    }
                    const fullPath = path_1.default.join(process.cwd(), input);
                    if (fs_extra_1.default.existsSync(fullPath)) {
                        return `Directory "${input}" already exists`;
                    }
                    return true;
                },
            },
        ]);
        targetDirectory = path_1.default.join(process.cwd(), newDirName);
        await fs_extra_1.default.ensureDir(targetDirectory);
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
        const { existingFilesAction } = await inquirer_1.default.prompt([
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
async function cleanExistingClaudeFiles(directory) {
    const files = checkExistingClaudeFiles(directory);
    if (files.hasClaudeDir) {
        await fs_extra_1.default.remove(path_1.default.join(directory, CLAUDE_FILES.claudeDir));
    }
    if (files.hasClaudeJson) {
        await fs_extra_1.default.remove(path_1.default.join(directory, CLAUDE_FILES.claudeJson));
    }
    if (files.hasClaudeMd) {
        await fs_extra_1.default.remove(path_1.default.join(directory, CLAUDE_FILES.claudeMd));
    }
    if (files.hasClaudeSetupMd) {
        await fs_extra_1.default.remove(path_1.default.join(directory, CLAUDE_FILES.claudeSetupMd));
    }
}
//# sourceMappingURL=setup.js.map