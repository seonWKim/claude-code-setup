import inquirer from 'inquirer';
import type {
  DeploymentPlatform,
  CICDPlatform,
  DatabaseClient,
} from '../types/index.js';

export interface DevOpsAnswers {
  deploymentPlatform: DeploymentPlatform;
  cicdPlatform: CICDPlatform;
  mcpIntegrations: string[];
}

export async function askDevOpsQuestions(
  databaseClient: DatabaseClient
): Promise<DevOpsAnswers> {
  const { deploymentPlatform } = await inquirer.prompt<{
    deploymentPlatform: DeploymentPlatform;
  }>([
    {
      type: 'list',
      name: 'deploymentPlatform',
      message: 'Where will you deploy your application?',
      choices: [
        { name: 'Vercel', value: 'vercel' },
        { name: 'Railway', value: 'railway' },
        { name: 'Cloudflare', value: 'cloudflare' },
        { name: 'AWS', value: 'aws' },
        { name: 'Docker / Self-hosted', value: 'docker' },
        { name: 'Not decided yet', value: 'none' },
      ],
    },
  ]);

  const { cicdPlatform } = await inquirer.prompt<{ cicdPlatform: CICDPlatform }>(
    [
      {
        type: 'list',
        name: 'cicdPlatform',
        message: 'What CI/CD platform will you use?',
        choices: [
          { name: 'GitHub Actions', value: 'github-actions' },
          { name: 'GitLab CI', value: 'gitlab-ci' },
          { name: 'None / Not needed', value: 'none' },
        ],
      },
    ]
  );

  // Build MCP integration choices based on context
  const mcpChoices: Array<{ name: string; value: string }> = [
    { name: 'GitHub (PRs, issues, repos)', value: 'github' },
    { name: 'Context7 (live documentation)', value: 'context7' },
    { name: 'Sequential Thinking (reasoning)', value: 'sequential-thinking' },
    { name: 'Memory (persistent memory)', value: 'memory' },
    { name: 'Firecrawl (web scraping)', value: 'firecrawl' },
    { name: 'Magic UI (UI components)', value: 'magic' },
  ];

  // Add platform-specific MCPs
  if (databaseClient === 'supabase') {
    mcpChoices.push({ name: 'Supabase (database ops)', value: 'supabase' });
  }

  if (deploymentPlatform === 'vercel') {
    mcpChoices.push({ name: 'Vercel (deployments)', value: 'vercel' });
  }

  if (deploymentPlatform === 'railway') {
    mcpChoices.push({ name: 'Railway (deployments)', value: 'railway' });
  }

  if (deploymentPlatform === 'cloudflare') {
    mcpChoices.push(
      { name: 'Cloudflare Docs', value: 'cloudflare-docs' },
      { name: 'Cloudflare Workers', value: 'cloudflare-workers-builds' }
    );
  }

  mcpChoices.push({ name: 'ClickHouse (analytics)', value: 'clickhouse' });

  const { mcpIntegrations } = await inquirer.prompt<{
    mcpIntegrations: string[];
  }>([
    {
      type: 'checkbox',
      name: 'mcpIntegrations',
      message: 'Which MCP integrations would you like to enable?',
      choices: mcpChoices,
      default: ['github', 'context7'],
    },
  ]);

  return {
    deploymentPlatform,
    cicdPlatform,
    mcpIntegrations,
  };
}
