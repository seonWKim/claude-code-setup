import inquirer from 'inquirer';
import type { TeamSize, GitWorkflow, ProjectGoal } from '../types/index.js';

export interface WorkflowAnswers {
  teamSize: TeamSize;
  gitWorkflow: GitWorkflow;
  requireCodeReview: boolean;
  enableHooks: boolean;
}

export async function askWorkflowQuestions(
  projectGoal: ProjectGoal
): Promise<WorkflowAnswers> {
  const { teamSize } = await inquirer.prompt<{ teamSize: TeamSize }>([
    {
      type: 'list',
      name: 'teamSize',
      message: 'What is your team size?',
      choices: [
        { name: 'Solo developer', value: 'solo' },
        { name: 'Small team (2-5)', value: 'small' },
        { name: 'Medium team (6-15)', value: 'medium' },
        { name: 'Large team (15+)', value: 'large' },
      ],
    },
  ]);

  const { gitWorkflow } = await inquirer.prompt<{ gitWorkflow: GitWorkflow }>([
    {
      type: 'list',
      name: 'gitWorkflow',
      message: 'What git workflow do you follow?',
      choices: [
        {
          name: 'Feature branches (branch per feature/fix)',
          value: 'feature-branches',
        },
        {
          name: 'Trunk-based (small, frequent commits to main)',
          value: 'trunk-based',
        },
        {
          name: 'GitFlow (develop, release, hotfix branches)',
          value: 'gitflow',
        },
      ],
      default: teamSize === 'solo' ? 'trunk-based' : 'feature-branches',
    },
  ]);

  const { requireCodeReview } = await inquirer.prompt<{
    requireCodeReview: boolean;
  }>([
    {
      type: 'confirm',
      name: 'requireCodeReview',
      message: 'Do you want Claude to follow code review guidelines?',
      default: teamSize !== 'solo',
    },
  ]);

  const { enableHooks } = await inquirer.prompt<{ enableHooks: boolean }>([
    {
      type: 'confirm',
      name: 'enableHooks',
      message:
        'Enable Claude Code hooks (auto-format, type-checking, git safeguards)?',
      default: projectGoal !== 'learning',
    },
  ]);

  return {
    teamSize,
    gitWorkflow,
    requireCodeReview,
    enableHooks,
  };
}
