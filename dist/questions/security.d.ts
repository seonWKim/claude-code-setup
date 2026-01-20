import type { SecurityLevel, AuthProvider, ProjectGoal, DatabaseClient } from '../types/index.js';
export interface SecurityAnswers {
    securityLevel: SecurityLevel;
    authProvider: AuthProvider;
    hasPayments: boolean;
    hasBlockchain: boolean;
}
export declare function askSecurityQuestions(projectGoal: ProjectGoal, databaseClient: DatabaseClient): Promise<SecurityAnswers>;
//# sourceMappingURL=security.d.ts.map