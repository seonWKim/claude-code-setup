import type { UserAnswers, CommandSelection } from '../types/index.js';

export function selectCommands(answers: UserAnswers): CommandSelection[] {
  const commands: CommandSelection[] = [];

  // Plan command - for production/enterprise
  if (
    answers.projectGoal === 'production' ||
    answers.projectGoal === 'enterprise'
  ) {
    commands.push({
      name: '/plan',
      filename: 'plan.md',
      reason: 'Structured planning for complex projects',
    });
  }

  // TDD command - for TDD approach
  if (answers.testingApproach === 'tdd') {
    commands.push({
      name: '/tdd',
      filename: 'tdd.md',
      reason: 'TDD approach selected',
    });
  }

  // Code review command - for teams
  if (answers.requireCodeReview || answers.teamSize !== 'solo') {
    commands.push({
      name: '/code-review',
      filename: 'code-review.md',
      reason: 'Team workflow includes code reviews',
    });
  }

  // Build fix command - for TypeScript/compiled projects
  if (
    answers.backendLanguage === 'typescript' ||
    answers.backendLanguage === 'go' ||
    answers.backendLanguage === 'rust' ||
    answers.backendLanguage === 'java' ||
    answers.hasFrontend
  ) {
    commands.push({
      name: '/build-fix',
      filename: 'build-fix.md',
      reason: 'Compiled language projects benefit from build error resolution',
    });
  }

  // E2E command - for E2E testing
  if (answers.e2eFramework !== 'none') {
    commands.push({
      name: '/e2e',
      filename: 'e2e.md',
      reason: `E2E testing with ${answers.e2eFramework}`,
    });
  }

  // Test coverage command - for standard+ testing
  if (
    answers.testingApproach !== 'none' &&
    answers.coverageTarget !== 'none'
  ) {
    commands.push({
      name: '/test-coverage',
      filename: 'test-coverage.md',
      reason: `Coverage target of ${answers.coverageTarget}% set`,
    });
  }

  // Refactor clean command - for production/enterprise
  if (
    answers.projectGoal === 'production' ||
    answers.projectGoal === 'enterprise'
  ) {
    commands.push({
      name: '/refactor-clean',
      filename: 'refactor-clean.md',
      reason: 'Production projects need refactoring capabilities',
    });
  }

  // Update docs command - for production/enterprise
  if (
    answers.projectGoal === 'production' ||
    answers.projectGoal === 'enterprise'
  ) {
    commands.push({
      name: '/update-docs',
      filename: 'update-docs.md',
      reason: 'Production projects need documentation updates',
    });
  }

  // Update codemaps command - for larger projects
  if (
    answers.projectType === 'monorepo' ||
    answers.projectGoal === 'enterprise'
  ) {
    commands.push({
      name: '/update-codemaps',
      filename: 'update-codemaps.md',
      reason: 'Large projects benefit from code map maintenance',
    });
  }

  return commands;
}
