"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSetupMd = exports.generateClaudeMd = exports.writeSettingsLocal = exports.writeClaudeJson = exports.copySelectedFiles = exports.cleanupTempDir = exports.cloneSourceRepo = void 0;
exports.generateConfiguration = generateConfiguration;
const clone_js_1 = require("./clone.js");
Object.defineProperty(exports, "cloneSourceRepo", { enumerable: true, get: function () { return clone_js_1.cloneSourceRepo; } });
Object.defineProperty(exports, "cleanupTempDir", { enumerable: true, get: function () { return clone_js_1.cleanupTempDir; } });
const copy_js_1 = require("./copy.js");
Object.defineProperty(exports, "copySelectedFiles", { enumerable: true, get: function () { return copy_js_1.copySelectedFiles; } });
Object.defineProperty(exports, "writeClaudeJson", { enumerable: true, get: function () { return copy_js_1.writeClaudeJson; } });
Object.defineProperty(exports, "writeSettingsLocal", { enumerable: true, get: function () { return copy_js_1.writeSettingsLocal; } });
const claude_md_js_1 = require("./claude-md.js");
Object.defineProperty(exports, "generateClaudeMd", { enumerable: true, get: function () { return claude_md_js_1.generateClaudeMd; } });
const setup_md_js_1 = require("./setup-md.js");
Object.defineProperty(exports, "generateSetupMd", { enumerable: true, get: function () { return setup_md_js_1.generateSetupMd; } });
const logger_js_1 = __importDefault(require("../utils/logger.js"));
async function generateConfiguration(targetDir, answers, components, options = {}) {
    let sourceDir = null;
    const upsertMode = options.existingFilesAction === 'upsert';
    try {
        logger_js_1.default.newline();
        logger_js_1.default.title('Generating Configuration...');
        if (upsertMode) {
            logger_js_1.default.info('Mode: Merging with existing files');
        }
        logger_js_1.default.newline();
        // Clone the source repository
        sourceDir = await (0, clone_js_1.cloneSourceRepo)();
        // Copy selected files
        await (0, copy_js_1.copySelectedFiles)(sourceDir, targetDir, components);
        // Generate configuration files
        await (0, copy_js_1.writeClaudeJson)(targetDir, components, upsertMode);
        await (0, copy_js_1.writeSettingsLocal)(targetDir, components, answers.enableHooks, upsertMode);
        // Generate documentation
        await (0, claude_md_js_1.generateClaudeMd)(targetDir, answers, components);
        await (0, setup_md_js_1.generateSetupMd)(targetDir, answers, components);
    }
    finally {
        // Always cleanup temp directory
        await (0, clone_js_1.cleanupTempDir)();
    }
}
//# sourceMappingURL=index.js.map