import inquirer from 'inquirer';
import type { TeamSize, GitWorkflow, ProjectGoal } from '../types/index.js';
import { askWithGoBack, GoBackError, GO_BACK_CHOICE } from '../utils/wizard.js';

export interface WorkflowAnswers {
  teamSize: TeamSize;
  gitWorkflow: GitWorkflow;
  requireCodeReview: boolean;
  enableHooks: boolean;
}

export async function askWorkflowQuestions(
  projectGoal: ProjectGoal,
  isFirstSection: boolean = false
): Promise<WorkflowAnswers> {
  const questionKeys = ['teamSize', 'gitWorkflow', 'requireCodeReview', 'enableHooks'];
  let currentIndex = 0;
  const answers: Partial<WorkflowAnswers> = {};

  while (currentIndex < questionKeys.length) {
    const isFirst = isFirstSection && currentIndex === 0;
    const questionKey = questionKeys[currentIndex];

    try {
      switch (questionKey) {
        case 'teamSize': {
          answers.teamSize = await askWithGoBack<TeamSize>({
            type: 'list',
            name: 'teamSize',
            message: 'What is your team size?',
            choices: [
              { name: 'Solo developer', value: 'solo' },
              { name: 'Small team (2-5)', value: 'small' },
              { name: 'Medium team (6-15)', value: 'medium' },
              { name: 'Large team (15+)', value: 'large' },
            ],
          }, isFirst);
          break;
        }

        case 'gitWorkflow': {
          answers.gitWorkflow = await askWithGoBack<GitWorkflow>({
            type: 'list',
            name: 'gitWorkflow',
            message: 'What git workflow do you follow?',
            choices: [
              { name: 'Feature branches (branch per feature/fix)', value: 'feature-branches' },
              { name: 'Trunk-based (small, frequent commits to main)', value: 'trunk-based' },
              { name: 'GitFlow (develop, release, hotfix branches)', value: 'gitflow' },
            ],
            default: answers.teamSize === 'solo' ? 'trunk-based' : 'feature-branches',
          }, false);
          break;
        }

        case 'requireCodeReview': {
          const codeReviewChoices = [
            { name: 'Yes', value: true },
            { name: 'No', value: false },
            new inquirer.Separator(),
            GO_BACK_CHOICE,
          ];
          answers.requireCodeReview = await askWithGoBack<boolean>({
            type: 'list',
            name: 'requireCodeReview',
            message: 'Do you want Claude to follow code review guidelines?',
            choices: codeReviewChoices,
            default: answers.teamSize !== 'solo',
          }, true);
          break;
        }

        case 'enableHooks': {
          const hooksChoices = [
            { name: 'Yes', value: true },
            { name: 'No', value: false },
            new inquirer.Separator(),
            GO_BACK_CHOICE,
          ];
          answers.enableHooks = await askWithGoBack<boolean>({
            type: 'list',
            name: 'enableHooks',
            message: 'Enable Claude Code hooks (auto-format, type-checking, git safeguards)?',
            choices: hooksChoices,
            default: projectGoal !== 'learning',
          }, true);
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

  return answers as WorkflowAnswers;
}
