import type { ProjectType, ProjectGoal } from '../types/index.js';
export interface ProjectAnswers {
    projectName: string;
    projectType: ProjectType;
    projectGoal: ProjectGoal;
}
export declare const projectQuestions: ({
    type: string;
    name: string;
    message: string;
    default: string;
    validate: (input: string) => true | "Project name is required" | "Project name can only contain letters, numbers, hyphens, and underscores";
    choices?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: {
        name: string;
        value: string;
    }[];
    default?: undefined;
    validate?: undefined;
})[];
export declare function askProjectQuestions(isFirstSection?: boolean): Promise<ProjectAnswers>;
//# sourceMappingURL=project.d.ts.map