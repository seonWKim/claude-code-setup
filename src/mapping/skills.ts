import type { UserAnswers, SkillSelection } from '../types/index.js';

export function selectSkills(answers: UserAnswers): SkillSelection[] {
  const skills: SkillSelection[] = [];

  // Coding standards - always for production/enterprise
  if (
    answers.projectGoal === 'production' ||
    answers.projectGoal === 'enterprise'
  ) {
    skills.push({
      name: 'Coding Standards',
      path: 'coding-standards.md',
      reason: 'Ensures consistent code quality',
    });
  }

  // Backend patterns - for backend projects
  if (answers.hasBackend) {
    skills.push({
      name: 'Backend Patterns',
      path: 'backend-patterns.md',
      reason: `Backend development with ${answers.backendLanguage}`,
    });
  }

  // Frontend patterns - for frontend projects
  if (answers.hasFrontend) {
    skills.push({
      name: 'Frontend Patterns',
      path: 'frontend-patterns.md',
      reason: `Frontend development with ${answers.frontendFramework}`,
    });
  }

  // Security review skill - for high security
  if (answers.securityLevel === 'high') {
    skills.push({
      name: 'Security Review',
      path: 'security-review',
      reason: 'High security level requires security review workflows',
    });
  }

  // TDD workflow skill - for TDD
  if (answers.testingApproach === 'tdd') {
    skills.push({
      name: 'TDD Workflow',
      path: 'tdd-workflow',
      reason: 'TDD approach selected',
    });
  }

  // ClickHouse skill - if using ClickHouse
  if (answers.mcpIntegrations.includes('clickhouse')) {
    skills.push({
      name: 'ClickHouse',
      path: 'clickhouse-io.md',
      reason: 'ClickHouse integration enabled',
    });
  }

  return skills;
}
