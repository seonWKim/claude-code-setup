import type { UserAnswers, RuleSelection } from '../types/index.js';

export function selectRules(answers: UserAnswers): RuleSelection[] {
  const rules: RuleSelection[] = [];

  // Coding style - for all except learning/MVP
  if (answers.projectGoal !== 'learning') {
    rules.push({
      name: 'Coding Style',
      filename: 'coding-style.md',
      reason: 'Maintains consistent code style',
      required: answers.projectGoal === 'enterprise',
    });
  }

  // Security rule - always for high security, recommended for medium
  if (answers.securityLevel === 'high' || answers.securityLevel === 'medium') {
    rules.push({
      name: 'Security',
      filename: 'security.md',
      reason:
        answers.securityLevel === 'high'
          ? 'High security level requires strict security rules'
          : 'Medium security level benefits from security guidelines',
      required: answers.securityLevel === 'high',
    });
  }

  // Testing rule - for standard+ testing
  if (answers.testingApproach !== 'none') {
    rules.push({
      name: 'Testing',
      filename: 'testing.md',
      reason: `Testing approach: ${answers.testingApproach}`,
      required: answers.testingApproach === 'tdd',
    });
  }

  // Git workflow - for teams
  if (answers.teamSize !== 'solo') {
    rules.push({
      name: 'Git Workflow',
      filename: 'git-workflow.md',
      reason: `Team collaboration using ${answers.gitWorkflow}`,
      required: answers.teamSize === 'large',
    });
  }

  // Patterns - for production/enterprise
  if (
    answers.projectGoal === 'production' ||
    answers.projectGoal === 'enterprise'
  ) {
    rules.push({
      name: 'Patterns',
      filename: 'patterns.md',
      reason: 'Production projects benefit from established patterns',
      required: false,
    });
  }

  // Performance - for production/enterprise
  if (
    answers.projectGoal === 'production' ||
    answers.projectGoal === 'enterprise'
  ) {
    rules.push({
      name: 'Performance',
      filename: 'performance.md',
      reason: 'Production projects need performance guidelines',
      required: answers.projectGoal === 'enterprise',
    });
  }

  // Hooks rule - if hooks enabled
  if (answers.enableHooks) {
    rules.push({
      name: 'Hooks',
      filename: 'hooks.md',
      reason: 'Hooks enabled for automated checks',
      required: false,
    });
  }

  // Agents rule - always include for context
  rules.push({
    name: 'Agents',
    filename: 'agents.md',
    reason: 'Provides guidance on using AI agents effectively',
    required: false,
  });

  return rules;
}
