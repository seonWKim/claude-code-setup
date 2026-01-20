#!/usr/bin/env node

import { Command } from 'commander';
import { askAllQuestions } from './questions/index.js';
import { mapAnswersToComponents } from './mapping/index.js';
import { generateConfiguration } from './generator/index.js';
import logger from './utils/logger.js';
import chalk from 'chalk';

const VERSION = '1.0.0';

async function main(): Promise<void> {
  const program = new Command();

  program
    .name('claude-code-setup')
    .description('Configure Claude Code for any project')
    .version(VERSION)
    .option('-d, --directory <path>', 'Target directory', process.cwd())
    .action(async (options) => {
      try {
        await runSetup(options.directory);
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error.message);
        } else {
          logger.error('An unexpected error occurred');
        }
        process.exit(1);
      }
    });

  await program.parseAsync();
}

async function runSetup(targetDir: string): Promise<void> {
  // Display banner
  logger.newline();
  logger.box([
    'Claude Code Setup',
    'Configure Claude Code for your project',
  ]);

  // Ask questions
  const answers = await askAllQuestions();

  // Map answers to components
  const components = mapAnswersToComponents(answers);

  // Display selected components
  logger.newline();
  logger.divider();
  logger.newline();
  logger.title('Selected Components:');
  logger.newline();

  if (components.agents.length > 0) {
    logger.info(
      `Agents: ${chalk.cyan(components.agents.map((a) => a.name).join(', '))}`
    );
  }

  if (components.commands.length > 0) {
    logger.info(
      `Commands: ${chalk.cyan(components.commands.map((c) => c.name).join(', '))}`
    );
  }

  if (components.skills.length > 0) {
    logger.info(
      `Skills: ${chalk.cyan(components.skills.map((s) => s.name).join(', '))}`
    );
  }

  if (components.rules.length > 0) {
    logger.info(
      `Rules: ${chalk.cyan(components.rules.map((r) => r.name).join(', '))}`
    );
  }

  if (components.mcpServers.length > 0) {
    logger.info(
      `MCP Servers: ${chalk.cyan(components.mcpServers.map((m) => m.name).join(', '))}`
    );
  }

  if (components.hooks.length > 0) {
    logger.info(
      `Hooks: ${chalk.cyan(components.hooks.map((h) => h.name).join(', '))}`
    );
  }

  // Generate configuration
  await generateConfiguration(targetDir, answers, components);

  // Display success message
  logger.newline();
  logger.box([
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
  logger.newline();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
