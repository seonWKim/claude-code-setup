import type { TestingApproach, TestFramework, E2EFramework, CoverageTarget, BackendLanguage, ProjectGoal } from '../types/index.js';
export interface TestingAnswers {
    testingApproach: TestingApproach;
    testFramework: TestFramework;
    e2eFramework: E2EFramework;
    coverageTarget: CoverageTarget;
}
export declare function askTestingQuestions(backendLanguage: BackendLanguage, projectGoal: ProjectGoal, hasFrontend: boolean, isFirstSection?: boolean): Promise<TestingAnswers>;
//# sourceMappingURL=testing.d.ts.map