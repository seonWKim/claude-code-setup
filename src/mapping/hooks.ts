import type { UserAnswers, HookSelection, HookConfig } from '../types/index.js';

export function selectHooks(answers: UserAnswers): HookSelection[] {
  if (!answers.enableHooks) {
    return [];
  }

  const hooks: HookSelection[] = [];

  // TypeScript/JavaScript hooks
  if (answers.backendLanguage === 'typescript' || answers.hasFrontend) {
    hooks.push({
      name: 'TypeScript Check',
      description: 'TypeScript check after editing .ts/.tsx files',
      reason: 'TypeScript projects benefit from immediate type checking',
    });

    hooks.push({
      name: 'Auto-format',
      description: 'Auto-format JS/TS files with Prettier after edits',
      reason: 'Maintains consistent formatting',
    });

    hooks.push({
      name: 'Console.log Warning',
      description: 'Warn about console.log statements after edits',
      reason: 'Prevents debug logs from reaching production',
    });
  }

  // Git hooks - for teams
  if (answers.teamSize !== 'solo') {
    hooks.push({
      name: 'Git Push Review',
      description: 'Pause before git push to review changes',
      reason: 'Team collaboration requires careful push reviews',
    });
  }

  // Dev server hook - always
  hooks.push({
    name: 'Dev Server Tmux',
    description: 'Block dev servers outside tmux - ensures you can access logs',
    reason: 'Ensures dev server logs are accessible',
  });

  // Long-running commands hook
  hooks.push({
    name: 'Tmux Reminder',
    description: 'Reminder to use tmux for long-running commands',
    reason: 'Session persistence for long-running tasks',
  });

  // Documentation block - for production
  if (
    answers.projectGoal === 'production' ||
    answers.projectGoal === 'enterprise'
  ) {
    hooks.push({
      name: 'Doc File Block',
      description: 'Block creation of random .md files - keeps docs consolidated',
      reason: 'Prevents documentation sprawl',
    });
  }

  // PR creation hook
  hooks.push({
    name: 'PR Helper',
    description: 'Log PR URL and provide review command after PR creation',
    reason: 'Streamlines PR workflow',
  });

  // Final console.log audit
  hooks.push({
    name: 'Final Console Audit',
    description:
      'Final audit for console.log in modified files before session ends',
    reason: 'Catches any missed debug logs',
  });

  return hooks;
}

export function generateHooksConfig(
  answers: UserAnswers
): HookConfig[] | undefined {
  if (!answers.enableHooks) {
    return undefined;
  }

  // Return the full hooks configuration from hooks.json
  // This is a subset based on user selections
  const preToolUse: HookConfig[] = [];
  const postToolUse: HookConfig[] = [];
  const stop: HookConfig[] = [];

  // Dev server block
  preToolUse.push({
    matcher:
      'tool == "Bash" && tool_input.command matches "(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)"',
    hooks: [
      {
        type: 'command',
        command: `#!/bin/bash
input=$(cat)
cmd=$(echo "$input" | jq -r '.tool_input.command // ""')

# Block dev servers that aren't run in tmux
echo '[Hook] BLOCKED: Dev server must run in tmux for log access' >&2
echo '[Hook] Use this command instead:' >&2
echo "[Hook] tmux new-session -d -s dev 'npm run dev'" >&2
echo '[Hook] Then: tmux attach -t dev' >&2
exit 1`,
      },
    ],
    description: 'Block dev servers outside tmux - ensures you can access logs',
  });

  // Tmux reminder
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
  echo '[Hook] tmux new -s dev  |  tmux attach -t dev' >&2
fi
echo "$input"`,
      },
    ],
    description: 'Reminder to use tmux for long-running commands',
  });

  // Git push review
  if (answers.teamSize !== 'solo') {
    preToolUse.push({
      matcher: 'tool == "Bash" && tool_input.command matches "git push"',
      hooks: [
        {
          type: 'command',
          command: `#!/bin/bash
# Open editor for review before pushing
echo '[Hook] Review changes before push...' >&2
echo '[Hook] Press Enter to continue with push or Ctrl+C to abort...' >&2
read -r`,
        },
      ],
      description: 'Pause before git push to review changes',
    });
  }

  // Doc file block
  if (
    answers.projectGoal === 'production' ||
    answers.projectGoal === 'enterprise'
  ) {
    preToolUse.push({
      matcher:
        'tool == "Write" && tool_input.file_path matches "\\\\.(md|txt)$" && !(tool_input.file_path matches "README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md")',
      hooks: [
        {
          type: 'command',
          command: `#!/bin/bash
# Block creation of unnecessary documentation files
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')

if [[ "$file_path" =~ \\.(md|txt)$ ]] && [[ ! "$file_path" =~ (README|CLAUDE|AGENTS|CONTRIBUTING)\\.md$ ]]; then
  echo "[Hook] BLOCKED: Unnecessary documentation file creation" >&2
  echo "[Hook] File: $file_path" >&2
  echo "[Hook] Use README.md for documentation instead" >&2
  exit 1
fi

echo "$input"`,
        },
      ],
      description: 'Block creation of random .md files - keeps docs consolidated',
    });
  }

  // PR helper
  postToolUse.push({
    matcher: 'tool == "Bash"',
    hooks: [
      {
        type: 'command',
        command: `#!/bin/bash
# Auto-detect PR creation and log useful info
input=$(cat)
cmd=$(echo "$input" | jq -r '.tool_input.command')

if echo "$cmd" | grep -qE 'gh pr create'; then
  output=$(echo "$input" | jq -r '.tool_output.output // ""')
  pr_url=$(echo "$output" | grep -oE 'https://github.com/[^/]+/[^/]+/pull/[0-9]+')

  if [ -n "$pr_url" ]; then
    echo "[Hook] PR created: $pr_url" >&2
    echo "[Hook] Checking GitHub Actions status..." >&2
    repo=$(echo "$pr_url" | sed -E 's|https://github.com/([^/]+/[^/]+)/pull/[0-9]+|\\1|')
    pr_num=$(echo "$pr_url" | sed -E 's|.*/pull/([0-9]+)|\\1|')
    echo "[Hook] To review PR: gh pr review $pr_num --repo $repo" >&2
  fi
fi

echo "$input"`,
      },
    ],
    description: 'Log PR URL and provide review command after PR creation',
  });

  // TypeScript/JavaScript specific hooks
  if (answers.backendLanguage === 'typescript' || answers.hasFrontend) {
    // Auto-format
    postToolUse.push({
      matcher:
        'tool == "Edit" && tool_input.file_path matches "\\\\.(ts|tsx|js|jsx)$"',
      hooks: [
        {
          type: 'command',
          command: `#!/bin/bash
# Auto-format with Prettier after editing JS/TS files
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')

if [ -n "$file_path" ] && [ -f "$file_path" ]; then
  if command -v prettier >/dev/null 2>&1; then
    prettier --write "$file_path" 2>&1 | head -5 >&2
  fi
fi

echo "$input"`,
        },
      ],
      description: 'Auto-format JS/TS files with Prettier after edits',
    });

    // TypeScript check
    postToolUse.push({
      matcher:
        'tool == "Edit" && tool_input.file_path matches "\\\\.(ts|tsx)$"',
      hooks: [
        {
          type: 'command',
          command: `#!/bin/bash
# Run TypeScript check after editing TS files
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')

if [ -n "$file_path" ] && [ -f "$file_path" ]; then
  dir=$(dirname "$file_path")
  project_root="$dir"
  while [ "$project_root" != "/" ] && [ ! -f "$project_root/package.json" ]; do
    project_root=$(dirname "$project_root")
  done

  if [ -f "$project_root/tsconfig.json" ]; then
    cd "$project_root" && npx tsc --noEmit --pretty false 2>&1 | grep "$file_path" | head -10 >&2 || true
  fi
fi

echo "$input"`,
        },
      ],
      description: 'TypeScript check after editing .ts/.tsx files',
    });

    // Console.log warning
    postToolUse.push({
      matcher:
        'tool == "Edit" && tool_input.file_path matches "\\\\.(ts|tsx|js|jsx)$"',
      hooks: [
        {
          type: 'command',
          command: `#!/bin/bash
# Warn about console.log in edited files
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')

if [ -n "$file_path" ] && [ -f "$file_path" ]; then
  console_logs=$(grep -n "console\\.log" "$file_path" 2>/dev/null || true)

  if [ -n "$console_logs" ]; then
    echo "[Hook] WARNING: console.log found in $file_path" >&2
    echo "$console_logs" | head -5 >&2
    echo "[Hook] Remove console.log before committing" >&2
  fi
fi

echo "$input"`,
        },
      ],
      description: 'Warn about console.log statements after edits',
    });

    // Final console.log audit
    stop.push({
      matcher: '*',
      hooks: [
        {
          type: 'command',
          command: `#!/bin/bash
# Final check for console.logs in modified files
input=$(cat)

if git rev-parse --git-dir > /dev/null 2>&1; then
  modified_files=$(git diff --name-only HEAD 2>/dev/null | grep -E '\\.(ts|tsx|js|jsx)$' || true)

  if [ -n "$modified_files" ]; then
    has_console=false
    while IFS= read -r file; do
      if [ -f "$file" ]; then
        if grep -q "console\\.log" "$file" 2>/dev/null; then
          echo "[Hook] WARNING: console.log found in $file" >&2
          has_console=true
        fi
      fi
    done <<< "$modified_files"

    if [ "$has_console" = true ]; then
      echo "[Hook] Remove console.log statements before committing" >&2
    fi
  fi
fi

echo "$input"`,
        },
      ],
      description: 'Final audit for console.log in modified files before session ends',
    });
  }

  return [...preToolUse, ...postToolUse, ...stop];
}
