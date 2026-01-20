import type { BackendLanguage, BackendFramework, Database, DatabaseClient, ProjectType } from '../types/index.js';
export interface BackendAnswers {
    hasBackend: boolean;
    backendLanguage: BackendLanguage;
    backendFramework: BackendFramework;
    database: Database;
    databaseClient: DatabaseClient;
}
export declare function askBackendQuestions(projectType: ProjectType, isFirstSection?: boolean): Promise<BackendAnswers>;
//# sourceMappingURL=backend.d.ts.map