import { askProjectQuestions } from './project.js';
import { askFrontendQuestions } from './frontend.js';
import { askBackendQuestions } from './backend.js';
import { askTestingQuestions } from './testing.js';
import { askSecurityQuestions } from './security.js';
import { askDevOpsQuestions } from './devops.js';
import { askWorkflowQuestions } from './workflow.js';
import type { UserAnswers } from '../types/index.js';
export declare function askAllQuestions(): Promise<UserAnswers>;
export { askProjectQuestions, askFrontendQuestions, askBackendQuestions, askTestingQuestions, askSecurityQuestions, askDevOpsQuestions, askWorkflowQuestions, };
export { askSetupQuestions, cleanExistingClaudeFiles } from './setup.js';
//# sourceMappingURL=index.d.ts.map