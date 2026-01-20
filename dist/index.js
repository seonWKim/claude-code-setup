#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_js_1 = require("./questions/index.js");
const index_js_2 = require("./mapping/index.js");
const index_js_3 = require("./generator/index.js");
const logger_js_1 = __importDefault(require("./utils/logger.js"));
const chalk_1 = __importDefault(require("chalk"));
const VERSION = '1.0.0';
async function main() {
    const program = new commander_1.Command();
    program
        .name('claude-code-setup')
        .description('Configure Claude Code for any project')
        .version(VERSION)
        .option('-d, --directory <path>', 'Target directory', process.cwd())
        .action(async (options) => {
        try {
            await runSetup(options.directory);
        }
        catch (error) {
            if (error instanceof Error) {
                logger_js_1.default.error(error.message);
            }
            else {
                logger_js_1.default.error('An unexpected error occurred');
            }
            process.exit(1);
        }
    });
    await program.parseAsync();
}
async function runSetup(targetDir) {
    // Display banner
    logger_js_1.default.newline();
    logger_js_1.default.box([
        'Claude Code Setup',
        'Configure Claude Code for your project',
    ]);
    // Ask questions
    const answers = await (0, index_js_1.askAllQuestions)();
    // Map answers to components
    const components = (0, index_js_2.mapAnswersToComponents)(answers);
    // Display selected components
    logger_js_1.default.newline();
    logger_js_1.default.divider();
    logger_js_1.default.newline();
    logger_js_1.default.title('Selected Components:');
    logger_js_1.default.newline();
    if (components.agents.length > 0) {
        logger_js_1.default.info(`Agents: ${chalk_1.default.cyan(components.agents.map((a) => a.name).join(', '))}`);
    }
    if (components.commands.length > 0) {
        logger_js_1.default.info(`Commands: ${chalk_1.default.cyan(components.commands.map((c) => c.name).join(', '))}`);
    }
    if (components.skills.length > 0) {
        logger_js_1.default.info(`Skills: ${chalk_1.default.cyan(components.skills.map((s) => s.name).join(', '))}`);
    }
    if (components.rules.length > 0) {
        logger_js_1.default.info(`Rules: ${chalk_1.default.cyan(components.rules.map((r) => r.name).join(', '))}`);
    }
    if (components.mcpServers.length > 0) {
        logger_js_1.default.info(`MCP Servers: ${chalk_1.default.cyan(components.mcpServers.map((m) => m.name).join(', '))}`);
    }
    if (components.hooks.length > 0) {
        logger_js_1.default.info(`Hooks: ${chalk_1.default.cyan(components.hooks.map((h) => h.name).join(', '))}`);
    }
    // Generate configuration
    await (0, index_js_3.generateConfiguration)(targetDir, answers, components);
    // Display success message
    logger_js_1.default.newline();
    logger_js_1.default.box([
        'Setup Complete!',
        '',
        'Files created:',
        '  .claude/',
        '  .claude.json',
        '  CLAUDE.md',
        '  CLAUDE_SETUP.md',
        '',
        'Next steps:',
        '  1. Review CLAUDE_SETUP.md',
        '  2. Add API keys to .claude.json',
        '  3. Start using your configured commands',
    ]);
    logger_js_1.default.newline();
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map