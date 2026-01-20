import type {
  TestingApproach,
  TestFramework,
  E2EFramework,
  CoverageTarget,
  BackendLanguage,
  ProjectGoal,
} from '../types/index.js';
import { askWithGoBack, GoBackError } from '../utils/wizard.js';

export interface TestingAnswers {
  testingApproach: TestingApproach;
  testFramework: TestFramework;
  e2eFramework: E2EFramework;
  coverageTarget: CoverageTarget;
}

export async function askTestingQuestions(
  backendLanguage: BackendLanguage,
  projectGoal: ProjectGoal,
  hasFrontend: boolean,
  isFirstSection: boolean = false
): Promise<TestingAnswers> {
  // Build question keys dynamically based on conditions
  const getQuestionKeys = (answers: Partial<TestingAnswers>) => {
    const keys = ['testingApproach'];
    if (answers.testingApproach && answers.testingApproach !== 'none') {
      keys.push('testFramework');
      if (hasFrontend && answers.testingApproach !== 'minimal') {
        keys.push('e2eFramework');
      }
      keys.push('coverageTarget');
    }
    return keys;
  };

  let currentIndex = 0;
  const answers: Partial<TestingAnswers> = {};

  while (true) {
    const questionKeys = getQuestionKeys(answers);
    if (currentIndex >= questionKeys.length) break;

    const isFirst = isFirstSection && currentIndex === 0;
    const questionKey = questionKeys[currentIndex];

    try {
      switch (questionKey) {
        case 'testingApproach': {
          const result = await askWithGoBack<TestingApproach>({
            type: 'list',
            name: 'testingApproach',
            message: 'What is your testing approach?',
            choices: [
              { name: 'TDD (Test-Driven Development)', value: 'tdd' },
              { name: 'Standard (write tests alongside code)', value: 'standard' },
              { name: 'Minimal (critical paths only)', value: 'minimal' },
              { name: 'None (skip testing setup)', value: 'none' },
            ],
            default: projectGoal === 'enterprise' ? 'tdd' : 'standard',
          }, isFirst);

          answers.testingApproach = result;

          if (result === 'none') {
            return {
              testingApproach: 'none',
              testFramework: 'none',
              e2eFramework: 'none',
              coverageTarget: 'none',
            };
          }
          break;
        }

        case 'testFramework': {
          answers.testFramework = await askWithGoBack<TestFramework>({
            type: 'list',
            name: 'testFramework',
            message: 'Which test framework will you use?',
            choices: getTestFrameworkChoices(backendLanguage),
          }, false);
          break;
        }

        case 'e2eFramework': {
          answers.e2eFramework = await askWithGoBack<E2EFramework>({
            type: 'list',
            name: 'e2eFramework',
            message: 'Do you want E2E testing?',
            choices: [
              { name: 'Playwright', value: 'playwright' },
              { name: 'Cypress', value: 'cypress' },
              { name: 'None', value: 'none' },
            ],
          }, false);
          break;
        }

        case 'coverageTarget': {
          answers.coverageTarget = await askWithGoBack<CoverageTarget>({
            type: 'list',
            name: 'coverageTarget',
            message: 'What is your target code coverage?',
            choices: [
              { name: '80% (high quality)', value: '80' },
              { name: '60% (balanced)', value: '60' },
              { name: '40% (essential coverage)', value: '40' },
              { name: 'No target', value: 'none' },
            ],
            default: projectGoal === 'enterprise' ? '80' : '60',
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
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  // Set defaults for skipped questions
  if (!answers.e2eFramework) {
    answers.e2eFramework = 'none';
  }

  return answers as TestingAnswers;
}

function getTestFrameworkChoices(
  language: BackendLanguage
): Array<{ name: string; value: TestFramework }> {
  switch (language) {
    case 'typescript':
      return [
        { name: 'Vitest', value: 'vitest' },
        { name: 'Jest', value: 'jest' },
      ];
    case 'python':
      return [
        { name: 'pytest', value: 'pytest' },
        { name: 'Built-in unittest', value: 'builtin' },
      ];
    case 'go':
      return [{ name: 'Go testing (built-in)', value: 'go-test' }];
    case 'rust':
      return [{ name: 'Cargo test (built-in)', value: 'cargo-test' }];
    case 'java':
      return [
        { name: 'JUnit', value: 'junit' },
        { name: 'Built-in', value: 'builtin' },
      ];
    default:
      return [
        { name: 'Vitest', value: 'vitest' },
        { name: 'Jest', value: 'jest' },
      ];
  }
}
