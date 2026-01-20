import inquirer from 'inquirer';
import type {
  DeploymentPlatform,
  CICDPlatform,
  DatabaseClient,
} from '../types/index.js';
import { askWithGoBack, GoBackError, GO_BACK_CHOICE, GO_BACK_VALUE } from '../utils/wizard.js';

export interface DevOpsAnswers {
  deploymentPlatform: DeploymentPlatform;
  cicdPlatform: CICDPlatform;
  mcpIntegrations: string[];
}

export async function askDevOpsQuestions(
  databaseClient: DatabaseClient,
  isFirstSection: boolean = false
): Promise<DevOpsAnswers> {
  const questionKeys = ['deploymentPlatform', 'cicdPlatform', 'mcpIntegrations'];
  let currentIndex = 0;
  const answers: Partial<DevOpsAnswers> = {};

  while (currentIndex < questionKeys.length) {
    const isFirst = isFirstSection && currentIndex === 0;
    const questionKey = questionKeys[currentIndex];

    try {
      switch (questionKey) {
        case 'deploymentPlatform': {
          answers.deploymentPlatform = await askWithGoBack<DeploymentPlatform>({
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
          }, isFirst);
          break;
        }

        case 'cicdPlatform': {
          answers.cicdPlatform = await askWithGoBack<CICDPlatform>({
            type: 'list',
            name: 'cicdPlatform',
            message: 'What CI/CD platform will you use?',
            choices: [
              { name: 'GitHub Actions', value: 'github-actions' },
              { name: 'GitLab CI', value: 'gitlab-ci' },
              { name: 'None / Not needed', value: 'none' },
            ],
          }, false);
          break;
        }

        case 'mcpIntegrations': {
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

          if (answers.deploymentPlatform === 'vercel') {
            mcpChoices.push({ name: 'Vercel (deployments)', value: 'vercel' });
          }

          if (answers.deploymentPlatform === 'railway') {
            mcpChoices.push({ name: 'Railway (deployments)', value: 'railway' });
          }

          if (answers.deploymentPlatform === 'cloudflare') {
            mcpChoices.push(
              { name: 'Cloudflare Docs', value: 'cloudflare-docs' },
              { name: 'Cloudflare Workers', value: 'cloudflare-workers-builds' }
            );
          }

          mcpChoices.push({ name: 'ClickHouse (analytics)', value: 'clickhouse' });

          // Add go back as a special checkbox choice
          mcpChoices.push(
            new inquirer.Separator() as unknown as { name: string; value: string },
            GO_BACK_CHOICE
          );

          const result = await inquirer.prompt<{ mcpIntegrations: string[] }>([
            {
              type: 'checkbox',
              name: 'mcpIntegrations',
              message: 'Which MCP integrations would you like to enable? (space to select, enter to confirm)',
              choices: mcpChoices,
              default: ['github', 'context7'],
            },
          ]);

          // Check if go back was selected
          if (result.mcpIntegrations.includes(GO_BACK_VALUE)) {
            throw new GoBackError();
          }

          answers.mcpIntegrations = result.mcpIntegrations;
          break;
        }
      }

      currentIndex++;
    } catch (error) {
      if (error instanceof GoBackError) {
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  return answers as DevOpsAnswers;
}
