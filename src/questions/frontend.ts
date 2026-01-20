import inquirer from 'inquirer';
import type {
  FrontendFramework,
  MetaFramework,
  StylingApproach,
  ProjectType,
} from '../types/index.js';

export interface FrontendAnswers {
  hasFrontend: boolean;
  frontendFramework: FrontendFramework;
  metaFramework: MetaFramework;
  stylingApproach: StylingApproach;
}

export async function askFrontendQuestions(
  projectType: ProjectType
): Promise<FrontendAnswers> {
  // Skip frontend questions for backend-only projects
  if (projectType === 'backend') {
    return {
      hasFrontend: false,
      frontendFramework: 'none',
      metaFramework: 'none',
      stylingApproach: 'vanilla-css',
    };
  }

  const { hasFrontend } = await inquirer.prompt<{ hasFrontend: boolean }>([
    {
      type: 'confirm',
      name: 'hasFrontend',
      message: 'Does your project have a frontend?',
      default: true,
    },
  ]);

  if (!hasFrontend) {
    return {
      hasFrontend: false,
      frontendFramework: 'none',
      metaFramework: 'none',
      stylingApproach: 'vanilla-css',
    };
  }

  const answers = await inquirer.prompt<{
    frontendFramework: FrontendFramework;
    metaFramework: MetaFramework;
    stylingApproach: StylingApproach;
  }>([
    {
      type: 'list',
      name: 'frontendFramework',
      message: 'Which frontend framework are you using?',
      choices: [
        { name: 'React', value: 'react' },
        { name: 'Vue', value: 'vue' },
        { name: 'Svelte', value: 'svelte' },
        { name: 'Angular', value: 'angular' },
        { name: 'Vanilla JavaScript/TypeScript', value: 'vanilla' },
      ],
    },
    {
      type: 'list',
      name: 'metaFramework',
      message: 'Are you using a meta-framework?',
      choices: (prevAnswers) => {
        const framework = prevAnswers.frontendFramework;
        const choices: Array<{ name: string; value: MetaFramework }> = [
          { name: 'None', value: 'none' },
        ];

        if (framework === 'react') {
          choices.unshift(
            { name: 'Next.js', value: 'nextjs' },
            { name: 'Remix', value: 'remix' },
            { name: 'Astro', value: 'astro' }
          );
        } else if (framework === 'vue') {
          choices.unshift(
            { name: 'Nuxt', value: 'nuxt' },
            { name: 'Astro', value: 'astro' }
          );
        } else if (framework === 'svelte') {
          choices.unshift(
            { name: 'SvelteKit', value: 'sveltekit' },
            { name: 'Astro', value: 'astro' }
          );
        }

        return choices;
      },
    },
    {
      type: 'list',
      name: 'stylingApproach',
      message: 'What styling approach are you using?',
      choices: [
        { name: 'Tailwind CSS', value: 'tailwind' },
        { name: 'CSS Modules', value: 'css-modules' },
        { name: 'styled-components / Emotion', value: 'styled-components' },
        { name: 'SCSS/Sass', value: 'scss' },
        { name: 'Vanilla CSS', value: 'vanilla-css' },
      ],
    },
  ]);

  return {
    hasFrontend: true,
    ...answers,
  };
}
