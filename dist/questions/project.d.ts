import type { ProjectType, ProjectGoal } from '../types/index.js';
export interface ProjectAnswers {
    projectName: string;
    projectType: ProjectType;
    projectGoal: ProjectGoal;
}
export declare function askProjectQuestions(): Promise<ProjectAnswers>;
//# sourceMappingURL=project.d.ts.map