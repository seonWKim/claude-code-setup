import type { DeploymentPlatform, CICDPlatform, DatabaseClient } from '../types/index.js';
export interface DevOpsAnswers {
    deploymentPlatform: DeploymentPlatform;
    cicdPlatform: CICDPlatform;
    mcpIntegrations: string[];
}
export declare function askDevOpsQuestions(databaseClient: DatabaseClient, isFirstSection?: boolean): Promise<DevOpsAnswers>;
//# sourceMappingURL=devops.d.ts.map