import inquirer from 'inquirer';
import type {
  FrontendFramework,
  MetaFramework,
  StylingApproach,
  ProjectType,
} from '../types/index.js';
import { askWithGoBack, GoBackError, GO_BACK_CHOICE } from '../utils/wizard.js';

export interface FrontendAnswers {
  hasFrontend: boolean;
  frontendFramework: FrontendFramework;
  metaFramework: MetaFramework;
  stylingApproach: StylingApproach;
}

function getMetaFrameworkChoices(framework: FrontendFramework) {
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
}

export async function askFrontendQuestions(
  projectType: ProjectType,
  isFirstSection: boolean = false
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

  const questions = [
    { key: 'hasFrontend', default: { hasFrontend: false, frontendFramework: 'none' as FrontendFramework, metaFramework: 'none' as MetaFramework, stylingApproach: 'vanilla-css' as StylingApproach } },
    { key: 'frontendFramework' },
    { key: 'metaFramework' },
    { key: 'stylingApproach' },
  ];

  let currentIndex = 0;
  const answers: Partial<FrontendAnswers> = {};

  while (currentIndex < questions.length) {
    const isFirst = isFirstSection && currentIndex === 0;
    const questionKey = questions[currentIndex].key;

    try {
      switch (questionKey) {
        case 'hasFrontend': {
          const hasFrontendChoices = [
            { name: 'Yes', value: true },
            { name: 'No', value: false },
            ...(!isFirst ? [new inquirer.Separator(), GO_BACK_CHOICE] : []),
          ];
          const hasFrontend = await askWithGoBack<boolean>({
            type: 'list',
            name: 'hasFrontend',
            message: 'Does your project have a frontend?',
            choices: hasFrontendChoices,
          }, true); // Pass true to skip adding go back again

          if (!hasFrontend) {
            return {
              hasFrontend: false,
              frontendFramework: 'none',
              metaFramework: 'none',
              stylingApproach: 'vanilla-css',
            };
          }
          answers.hasFrontend = true;
          break;
        }

        case 'frontendFramework': {
          answers.frontendFramework = await askWithGoBack<FrontendFramework>({
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
          }, false);
          break;
        }

        case 'metaFramework': {
          answers.metaFramework = await askWithGoBack<MetaFramework>({
            type: 'list',
            name: 'metaFramework',
            message: 'Are you using a meta-framework?',
            choices: getMetaFrameworkChoices(answers.frontendFramework!),
          }, false);
          break;
        }

        case 'stylingApproach': {
          answers.stylingApproach = await askWithGoBack<StylingApproach>({
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
          }, false);
          break;
        }
      }

      currentIndex++;
    } catch (error) {
      if (error instanceof GoBackError) {
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          throw error; // Propagate to go back to previous section
        }
      } else {
        throw error;
      }
    }
  }

  return answers as FrontendAnswers;
}
