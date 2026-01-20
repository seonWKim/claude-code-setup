import type { TeamSize, GitWorkflow, ProjectGoal } from '../types/index.js';
export interface WorkflowAnswers {
    teamSize: TeamSize;
    gitWorkflow: GitWorkflow;
    requireCodeReview: boolean;
    enableHooks: boolean;
}
export declare function askWorkflowQuestions(projectGoal: ProjectGoal, isFirstSection?: boolean): Promise<WorkflowAnswers>;
//# sourceMappingURL=workflow.d.ts.map