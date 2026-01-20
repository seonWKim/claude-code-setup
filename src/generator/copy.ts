import fs from 'fs-extra';
import path from 'path';
import type { SelectedComponents } from '../types/index.js';
import spinner from '../utils/spinner.js';

export async function copySelectedFiles(
  sourceDir: string,
  targetDir: string,
  components: SelectedComponents
): Promise<void> {
  const claudeDir = path.join(targetDir, '.claude');

  // Ensure .claude directory exists
  await fs.ensureDir(claudeDir);

  // Copy agents
  if (components.agents.length > 0) {
    spinner.start('Copying agents...');
    const agentsDir = path.join(claudeDir, 'agents');
    await fs.ensureDir(agentsDir);

    for (const agent of components.agents) {
      const sourcePath = path.join(sourceDir, 'agents', agent.filename);
      const targetPath = path.join(agentsDir, agent.filename);

      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, targetPath);
      }
    }
    spinner.succeed(`Copied ${components.agents.length} agents`);
  }

  // Copy commands
  if (components.commands.length > 0) {
    spinner.start('Copying commands...');
    const commandsDir = path.join(claudeDir, 'commands');
    await fs.ensureDir(commandsDir);

    for (const command of components.commands) {
      const sourcePath = path.join(sourceDir, 'commands', command.filename);
      const targetPath = path.join(commandsDir, command.filename);

      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, targetPath);
      }
    }
    spinner.succeed(`Copied ${components.commands.length} commands`);
  }

  // Copy skills
  if (components.skills.length > 0) {
    spinner.start('Copying skills...');
    const skillsDir = path.join(claudeDir, 'skills');
    await fs.ensureDir(skillsDir);

    for (const skill of components.skills) {
      const sourcePath = path.join(sourceDir, 'skills', skill.path);
      const targetPath = path.join(skillsDir, skill.path);

      if (await fs.pathExists(sourcePath)) {
        // Check if it's a directory or file
        const stat = await fs.stat(sourcePath);
        if (stat.isDirectory()) {
          await fs.copy(sourcePath, targetPath);
        } else {
          await fs.ensureDir(path.dirname(targetPath));
          await fs.copy(sourcePath, targetPath);
        }
      }
    }
    spinner.succeed(`Copied ${components.skills.length} skills`);
  }

  // Copy rules
  if (components.rules.length > 0) {
    spinner.start('Copying rules...');
    const rulesDir = path.join(claudeDir, 'rules');
    await fs.ensureDir(rulesDir);

    for (const rule of components.rules) {
      const sourcePath = path.join(sourceDir, 'rules', rule.filename);
      const targetPath = path.join(rulesDir, rule.filename);

      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, targetPath);
      }
    }
    spinner.succeed(`Copied ${components.rules.length} rules`);
  }
}

export async function writeClaudeJson(
  targetDir: string,
  components: SelectedComponents
): Promise<void> {
  spinner.start('Generating .claude.json...');

  const mcpServers: Record<string, unknown> = {};

  for (const server of components.mcpServers) {
    mcpServers[server.name] = server.config;
  }

  const claudeJson = {
    mcpServers,
  };

  await fs.writeJson(path.join(targetDir, '.claude.json'), claudeJson, {
    spaces: 2,
  });

  spinner.succeed('Generated .claude.json');
}

export async function writeSettingsLocal(
  targetDir: string,
  components: SelectedComponents,
  enableHooks: boolean
): Promise<void> {
  if (!enableHooks || components.hooks.length === 0) {
    return;
  }

  spinner.start('Generating settings.local.json...');

  const claudeDir = path.join(targetDir, '.claude');
  await fs.ensureDir(claudeDir);

  // Build hooks config
  const preToolUse: unknown[] = [];
  const postToolUse: unknown[] = [];
  const stop: unknown[] = [];

  // Add dev server block
  preToolUse.push({
    matcher:
      'tool == "Bash" && tool_input.command matches "(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)"',
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
    matcher:
      'tool == "Bash" && tool_input.command matches "(npm (install|test)|pnpm (install|test)|yarn (install|test)|bun (install|test)|cargo build|make|docker|pytest|vitest|playwright)"',
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

  const settingsLocal = {
    $schema: 'https://json.schemastore.org/claude-code-settings.json',
    hooks: {
      PreToolUse: preToolUse,
      PostToolUse: postToolUse,
      Stop: stop.length > 0 ? stop : undefined,
    },
  };

  await fs.writeJson(
    path.join(claudeDir, 'settings.local.json'),
    settingsLocal,
    { spaces: 2 }
  );

  spinner.succeed('Generated settings.local.json');
}
