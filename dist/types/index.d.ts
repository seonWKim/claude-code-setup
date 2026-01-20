export type ProjectType = 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'library' | 'monorepo';
export type ProjectGoal = 'mvp' | 'production' | 'learning' | 'enterprise';
export type FrontendFramework = 'react' | 'vue' | 'svelte' | 'angular' | 'vanilla' | 'none';
export type MetaFramework = 'nextjs' | 'remix' | 'nuxt' | 'sveltekit' | 'astro' | 'none';
export type StylingApproach = 'tailwind' | 'css-modules' | 'styled-components' | 'scss' | 'vanilla-css';
export type BackendLanguage = 'typescript' | 'go' | 'rust' | 'java' | 'python' | 'none';
export type BackendFramework = 'express' | 'fastify' | 'nestjs' | 'hono' | 'gin' | 'axum' | 'spring' | 'fastapi' | 'django' | 'none';
export type Database = 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'none';
export type DatabaseClient = 'supabase' | 'prisma' | 'drizzle' | 'typeorm' | 'sqlalchemy' | 'raw' | 'none';
export type TestingApproach = 'tdd' | 'standard' | 'minimal' | 'none';
export type TestFramework = 'vitest' | 'jest' | 'pytest' | 'go-test' | 'cargo-test' | 'junit' | 'builtin' | 'none';
export type E2EFramework = 'playwright' | 'cypress' | 'none';
export type CoverageTarget = '80' | '60' | '40' | 'none';
export type SecurityLevel = 'high' | 'medium' | 'low';
export type AuthProvider = 'supabase' | 'nextauth' | 'clerk' | 'auth0' | 'custom' | 'none';
export type DeploymentPlatform = 'vercel' | 'railway' | 'cloudflare' | 'aws' | 'docker' | 'none';
export type CICDPlatform = 'github-actions' | 'gitlab-ci' | 'none';
export type TeamSize = 'solo' | 'small' | 'medium' | 'large';
export type GitWorkflow = 'feature-branches' | 'trunk-based' | 'gitflow';
export interface UserAnswers {
    projectName: string;
    projectType: ProjectType;
    projectGoal: ProjectGoal;
    hasFrontend: boolean;
    frontendFramework: FrontendFramework;
    metaFramework: MetaFramework;
    stylingApproach: StylingApproach;
    hasBackend: boolean;
    backendLanguage: BackendLanguage;
    backendFramework: BackendFramework;
    database: Database;
    databaseClient: DatabaseClient;
    testingApproach: TestingApproach;
    testFramework: TestFramework;
    e2eFramework: E2EFramework;
    coverageTarget: CoverageTarget;
    securityLevel: SecurityLevel;
    authProvider: AuthProvider;
    hasPayments: boolean;
    hasBlockchain: boolean;
    deploymentPlatform: DeploymentPlatform;
    cicdPlatform: CICDPlatform;
    mcpIntegrations: string[];
    teamSize: TeamSize;
    gitWorkflow: GitWorkflow;
    requireCodeReview: boolean;
    enableHooks: boolean;
}
export interface SelectedComponents {
    agents: AgentSelection[];
    commands: CommandSelection[];
    skills: SkillSelection[];
    rules: RuleSelection[];
    hooks: HookSelection[];
    mcpServers: MCPServerSelection[];
}
export interface AgentSelection {
    name: string;
    filename: string;
    reason: string;
}
export interface CommandSelection {
    name: string;
    filename: string;
    reason: string;
}
export interface SkillSelection {
    name: string;
    path: string;
    reason: string;
}
export interface RuleSelection {
    name: string;
    filename: string;
    reason: string;
    required: boolean;
}
export interface HookSelection {
    name: string;
    description: string;
    reason: string;
}
export interface MCPServerSelection {
    name: string;
    config: MCPServerConfig;
    reason: string;
}
export interface MCPServerConfig {
    command?: string;
    args?: string[];
    env?: Record<string, string>;
    type?: 'http';
    url?: string;
    description: string;
}
export interface GeneratedConfig {
    claudeMd: string;
    claudeSetupMd: string;
    claudeJson: ClaudeJsonConfig;
    settingsLocalJson: SettingsLocalConfig;
}
export interface ClaudeJsonConfig {
    mcpServers: Record<string, MCPServerConfig>;
}
export interface SettingsLocalConfig {
    $schema: string;
    hooks: {
        PreToolUse?: HookConfig[];
        PostToolUse?: HookConfig[];
        Stop?: HookConfig[];
    };
}
export interface HookConfig {
    matcher: string;
    hooks: Array<{
        type: string;
        command: string;
    }>;
    description: string;
}
export interface AvailableComponents {
    agents: string[];
    commands: string[];
    skills: string[];
    rules: string[];
}
//# sourceMappingURL=index.d.ts.map