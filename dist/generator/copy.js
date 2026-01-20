"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copySelectedFiles = copySelectedFiles;
exports.writeClaudeJson = writeClaudeJson;
exports.writeSettingsLocal = writeSettingsLocal;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const spinner_js_1 = __importDefault(require("../utils/spinner.js"));
async function copySelectedFiles(sourceDir, targetDir, components) {
    const claudeDir = path_1.default.join(targetDir, '.claude');
    // Ensure .claude directory exists
    await fs_extra_1.default.ensureDir(claudeDir);
    // Copy agents
    if (components.agents.length > 0) {
        spinner_js_1.default.start('Copying agents...');
        const agentsDir = path_1.default.join(claudeDir, 'agents');
        await fs_extra_1.default.ensureDir(agentsDir);
        for (const agent of components.agents) {
            const sourcePath = path_1.default.join(sourceDir, 'agents', agent.filename);
            const targetPath = path_1.default.join(agentsDir, agent.filename);
            if (await fs_extra_1.default.pathExists(sourcePath)) {
                await fs_extra_1.default.copy(sourcePath, targetPath);
            }
        }
        spinner_js_1.default.succeed(`Copied ${components.agents.length} agents`);
    }
    // Copy commands
    if (components.commands.length > 0) {
        spinner_js_1.default.start('Copying commands...');
        const commandsDir = path_1.default.join(claudeDir, 'commands');
        await fs_extra_1.default.ensureDir(commandsDir);
        for (const command of components.commands) {
            const sourcePath = path_1.default.join(sourceDir, 'commands', command.filename);
            const targetPath = path_1.default.join(commandsDir, command.filename);
            if (await fs_extra_1.default.pathExists(sourcePath)) {
                await fs_extra_1.default.copy(sourcePath, targetPath);
            }
        }
        spinner_js_1.default.succeed(`Copied ${components.commands.length} commands`);
    }
    // Copy skills
    if (components.skills.length > 0) {
        spinner_js_1.default.start('Copying skills...');
        const skillsDir = path_1.default.join(claudeDir, 'skills');
        await fs_extra_1.default.ensureDir(skillsDir);
        for (const skill of components.skills) {
            const sourcePath = path_1.default.join(sourceDir, 'skills', skill.path);
            const targetPath = path_1.default.join(skillsDir, skill.path);
            if (await fs_extra_1.default.pathExists(sourcePath)) {
                // Check if it's a directory or file
                const stat = await fs_extra_1.default.stat(sourcePath);
                if (stat.isDirectory()) {
                    await fs_extra_1.default.copy(sourcePath, targetPath);
                }
                else {
                    await fs_extra_1.default.ensureDir(path_1.default.dirname(targetPath));
                    await fs_extra_1.default.copy(sourcePath, targetPath);
                }
            }
        }
        spinner_js_1.default.succeed(`Copied ${components.skills.length} skills`);
    }
    // Copy rules
    if (components.rules.length > 0) {
        spinner_js_1.default.start('Copying rules...');
        const rulesDir = path_1.default.join(claudeDir, 'rules');
        await fs_extra_1.default.ensureDir(rulesDir);
        for (const rule of components.rules) {
            const sourcePath = path_1.default.join(sourceDir, 'rules', rule.filename);
            const targetPath = path_1.default.join(rulesDir, rule.filename);
            if (await fs_extra_1.default.pathExists(sourcePath)) {
                await fs_extra_1.default.copy(sourcePath, targetPath);
            }
        }
        spinner_js_1.default.succeed(`Copied ${components.rules.length} rules`);
    }
}
async function writeClaudeJson(targetDir, components, upsertMode = false) {
    const claudeJsonPath = path_1.default.join(targetDir, '.claude.json');
    if (upsertMode) {
        spinner_js_1.default.start('Merging .claude.json...');
    }
    else {
        spinner_js_1.default.start('Generating .claude.json...');
    }
    let existingConfig = {};
    // Read existing config if in upsert mode
    if (upsertMode && await fs_extra_1.default.pathExists(claudeJsonPath)) {
        try {
            existingConfig = await fs_extra_1.default.readJson(claudeJsonPath);
        }
        catch {
            // If file is corrupted, start fresh
            existingConfig = {};
        }
    }
    const mcpServers = {
        ...(existingConfig.mcpServers || {}),
    };
    for (const server of components.mcpServers) {
        mcpServers[server.name] = server.config;
    }
    const claudeJson = {
        ...existingConfig,
        mcpServers,
    };
    await fs_extra_1.default.writeJson(claudeJsonPath, claudeJson, {
        spaces: 2,
    });
    if (upsertMode) {
        spinner_js_1.default.succeed('Merged .claude.json');
    }
    else {
        spinner_js_1.default.succeed('Generated .claude.json');
    }
}
async function writeSettingsLocal(targetDir, components, enableHooks, upsertMode = false) {
    if (!enableHooks || components.hooks.length === 0) {
        return;
    }
    const claudeDir = path_1.default.join(targetDir, '.claude');
    const settingsPath = path_1.default.join(claudeDir, 'settings.local.json');
    if (upsertMode) {
        spinner_js_1.default.start('Merging settings.local.json...');
    }
    else {
        spinner_js_1.default.start('Generating settings.local.json...');
    }
    await fs_extra_1.default.ensureDir(claudeDir);
    let existingConfig = {};
    if (upsertMode && await fs_extra_1.default.pathExists(settingsPath)) {
        try {
            existingConfig = await fs_extra_1.default.readJson(settingsPath);
        }
        catch {
            existingConfig = {};
        }
    }
    // Build hooks config
    const preToolUse = [];
    const postToolUse = [];
    const stop = [];
    // Add dev server block
    preToolUse.push({
        matcher: 'tool == "Bash" && tool_input.command matches "(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)"',
        hooks: [
            {
                type: 'command',
                command: `#!/bin/bash
input=$(cat)
echo '[Hook] BLOCKED: Dev server must run in tmux for log access' >&2
echo '[Hook] Use: tmux new-session -d -s dev "npm run dev"' >&2
echo '[Hook] Then: tmux attach -t dev' >&2
exit 1`,
            },
        ],
        description: 'Block dev servers outside tmux - ensures you can access logs',
    });
    // Add tmux reminder
    preToolUse.push({
        matcher: 'tool == "Bash" && tool_input.command matches "(npm (install|test)|pnpm (install|test)|yarn (install|test)|bun (install|test)|cargo build|make|docker|pytest|vitest|playwright)"',
        hooks: [
            {
                type: 'command',
                command: `#!/bin/bash
input=$(cat)
if [ -z "$TMUX" ]; then
  echo '[Hook] Consider running in tmux for session persistence' >&2
fi
echo "$input"`,
            },
        ],
        description: 'Reminder to use tmux for long-running commands',
    });
    // Add PR helper
    postToolUse.push({
        matcher: 'tool == "Bash"',
        hooks: [
            {
                type: 'command',
                command: `#!/bin/bash
input=$(cat)
cmd=$(echo "$input" | jq -r '.tool_input.command')
if echo "$cmd" | grep -qE 'gh pr create'; then
  output=$(echo "$input" | jq -r '.tool_output.output // ""')
  pr_url=$(echo "$output" | grep -oE 'https://github.com/[^/]+/[^/]+/pull/[0-9]+')
  if [ -n "$pr_url" ]; then
    echo "[Hook] PR created: $pr_url" >&2
  fi
fi
echo "$input"`,
            },
        ],
        description: 'Log PR URL after PR creation',
    });
    // Merge with existing hooks if in upsert mode
    const existingHooks = existingConfig.hooks || {};
    const mergedPreToolUse = [...(existingHooks.PreToolUse || []), ...preToolUse];
    const mergedPostToolUse = [...(existingHooks.PostToolUse || []), ...postToolUse];
    const mergedStop = [...(existingHooks.Stop || []), ...stop];
    const settingsLocal = {
        ...existingConfig,
        $schema: 'https://json.schemastore.org/claude-code-settings.json',
        hooks: {
            PreToolUse: mergedPreToolUse.length > 0 ? mergedPreToolUse : undefined,
            PostToolUse: mergedPostToolUse.length > 0 ? mergedPostToolUse : undefined,
            Stop: mergedStop.length > 0 ? mergedStop : undefined,
        },
    };
    await fs_extra_1.default.writeJson(settingsPath, settingsLocal, { spaces: 2 });
    if (upsertMode) {
        spinner_js_1.default.succeed('Merged settings.local.json');
    }
    else {
        spinner_js_1.default.succeed('Generated settings.local.json');
    }
}
//# sourceMappingURL=copy.js.map