"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneSourceRepo = cloneSourceRepo;
exports.cleanupTempDir = cleanupTempDir;
exports.getTempDir = getTempDir;
const simple_git_1 = __importDefault(require("simple-git"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const spinner_js_1 = __importDefault(require("../utils/spinner.js"));
const REPO_URL = 'https://github.com/affaan-m/everything-claude-code';
const TEMP_DIR_PREFIX = 'claude-code-setup-';
let tempDir = null;
async function cloneSourceRepo() {
    // Create temp directory
    tempDir = await fs_extra_1.default.mkdtemp(path_1.default.join(os_1.default.tmpdir(), TEMP_DIR_PREFIX));
    spinner_js_1.default.start('Downloading configurations from GitHub...');
    try {
        const git = (0, simple_git_1.default)();
        await git.clone(REPO_URL, tempDir, ['--depth', '1']);
        spinner_js_1.default.succeed('Downloaded configurations');
        return tempDir;
    }
    catch (error) {
        spinner_js_1.default.fail('Failed to download configurations');
        throw error;
    }
}
async function cleanupTempDir() {
    if (tempDir && (await fs_extra_1.default.pathExists(tempDir))) {
        await fs_extra_1.default.remove(tempDir);
        tempDir = null;
    }
}
function getTempDir() {
    return tempDir;
}
//# sourceMappingURL=clone.js.map