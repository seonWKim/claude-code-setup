import type { FrontendFramework, MetaFramework, StylingApproach, ProjectType } from '../types/index.js';
export interface FrontendAnswers {
    hasFrontend: boolean;
    frontendFramework: FrontendFramework;
    metaFramework: MetaFramework;
    stylingApproach: StylingApproach;
}
export declare function askFrontendQuestions(projectType: ProjectType): Promise<FrontendAnswers>;
//# sourceMappingURL=frontend.d.ts.map