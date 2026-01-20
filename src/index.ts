#!/usr/bin/env node

import { Command } from 'commander';
import { askAllQuestions } from './questions/index.js';
import { askSetupQuestions, cleanExistingClaudeFiles } from './questions/setup.js';
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
    .action(async () => {
      try {
        await runSetup();
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

async function runSetup(): Promise<void> {
  // Display banner
  logger.newline();
  logger.box([
    'Claude Code Setup',
    'Configure Claude Code for your project',
  ]);

  // Ask setup questions (directory mode, existing files handling)
  logger.newline();
  logger.title('Setup');
  logger.newline();

  const setupAnswers = await askSetupQuestions();
  const targetDir = setupAnswers.targetDirectory;

  // Clean existing files if user chose 'clean' mode
  if (setupAnswers.existingFilesAction === 'clean') {
    logger.info('Removing existing Claude files...');
    await cleanExistingClaudeFiles(targetDir);
    logger.success('Existing files removed');
  }

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
  await generateConfiguration(targetDir, answers, components, {
    existingFilesAction: setupAnswers.existingFilesAction,
  });

  // Display success message
  const isNewDir = setupAnswers.directoryMode === 'new';
  const successMessage = [
    'Setup Complete!',
    '',
    `Target directory: ${targetDir}`,
    '',
    'Files created:',
    '  .claude/',
    '  .claude.json',
    '  CLAUDE.md',
    '  CLAUDE_SETUP.md',
    '',
    'Next steps:',
  ];

  if (isNewDir) {
    successMessage.push(`  1. cd ${setupAnswers.targetDirectory.split('/').pop()}`);
    successMessage.push('  2. Review CLAUDE_SETUP.md');
    successMessage.push('  3. Add API keys to .claude.json');
    successMessage.push('  4. Start using your configured commands');
  } else {
    successMessage.push('  1. Review CLAUDE_SETUP.md');
    successMessage.push('  2. Add API keys to .claude.json');
    successMessage.push('  3. Start using your configured commands');
  }

  logger.newline();
  logger.box(successMessage);
  logger.newline();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
