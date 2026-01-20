import { askProjectQuestions } from './project.js';
import { askFrontendQuestions } from './frontend.js';
import { askBackendQuestions } from './backend.js';
import { askTestingQuestions } from './testing.js';
import { askSecurityQuestions } from './security.js';
import { askDevOpsQuestions } from './devops.js';
import { askWorkflowQuestions } from './workflow.js';
import type { UserAnswers } from '../types/index.js';
import logger from '../utils/logger.js';

export async function askAllQuestions(): Promise<UserAnswers> {
  logger.newline();
  logger.title('Project Configuration');
  logger.newline();

  // 1. Project questions
  const projectAnswers = await askProjectQuestions();

  logger.newline();
  logger.title('Frontend Stack');
  logger.newline();

  // 2. Frontend questions
  const frontendAnswers = await askFrontendQuestions(projectAnswers.projectType);

  logger.newline();
  logger.title('Backend Stack');
  logger.newline();

  // 3. Backend questions
  const backendAnswers = await askBackendQuestions(projectAnswers.projectType);

  logger.newline();
  logger.title('Testing Strategy');
  logger.newline();

  // 4. Testing questions
  const testingAnswers = await askTestingQuestions(
    backendAnswers.backendLanguage,
    projectAnswers.projectGoal,
    frontendAnswers.hasFrontend
  );

  logger.newline();
  logger.title('Security');
  logger.newline();

  // 5. Security questions
  const securityAnswers = await askSecurityQuestions(
    projectAnswers.projectGoal,
    backendAnswers.databaseClient
  );

  logger.newline();
  logger.title('DevOps & Integrations');
  logger.newline();

  // 6. DevOps questions
  const devopsAnswers = await askDevOpsQuestions(backendAnswers.databaseClient);

  logger.newline();
  logger.title('Workflow');
  logger.newline();

  // 7. Workflow questions
  const workflowAnswers = await askWorkflowQuestions(projectAnswers.projectGoal);

  return {
    ...projectAnswers,
    ...frontendAnswers,
    ...backendAnswers,
    ...testingAnswers,
    ...securityAnswers,
    ...devopsAnswers,
    ...workflowAnswers,
  };
}

export {
  askProjectQuestions,
  askFrontendQuestions,
  askBackendQuestions,
  askTestingQuestions,
  askSecurityQuestions,
  askDevOpsQuestions,
  askWorkflowQuestions,
};
