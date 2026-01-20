import inquirer from 'inquirer';
import type {
  TestingApproach,
  TestFramework,
  E2EFramework,
  CoverageTarget,
  BackendLanguage,
  ProjectGoal,
} from '../types/index.js';

export interface TestingAnswers {
  testingApproach: TestingApproach;
  testFramework: TestFramework;
  e2eFramework: E2EFramework;
  coverageTarget: CoverageTarget;
}

export async function askTestingQuestions(
  backendLanguage: BackendLanguage,
  projectGoal: ProjectGoal,
  hasFrontend: boolean
): Promise<TestingAnswers> {
  const { testingApproach } = await inquirer.prompt<{
    testingApproach: TestingApproach;
  }>([
    {
      type: 'list',
      name: 'testingApproach',
      message: 'What is your testing approach?',
      choices: [
        {
          name: 'TDD (Test-Driven Development)',
          value: 'tdd',
        },
        {
          name: 'Standard (write tests alongside code)',
          value: 'standard',
        },
        {
          name: 'Minimal (critical paths only)',
          value: 'minimal',
        },
        {
          name: 'None (skip testing setup)',
          value: 'none',
        },
      ],
      default: projectGoal === 'enterprise' ? 'tdd' : 'standard',
    },
  ]);

  if (testingApproach === 'none') {
    return {
      testingApproach: 'none',
      testFramework: 'none',
      e2eFramework: 'none',
      coverageTarget: 'none',
    };
  }

  const testFrameworkChoices = getTestFrameworkChoices(backendLanguage);

  const { testFramework } = await inquirer.prompt<{
    testFramework: TestFramework;
  }>([
    {
      type: 'list',
      name: 'testFramework',
      message: 'Which test framework will you use?',
      choices: testFrameworkChoices,
    },
  ]);

  let e2eFramework: E2EFramework = 'none';

  if (hasFrontend && testingApproach !== 'minimal') {
    const e2eAnswer = await inquirer.prompt<{ e2eFramework: E2EFramework }>([
      {
        type: 'list',
        name: 'e2eFramework',
        message: 'Do you want E2E testing?',
        choices: [
          { name: 'Playwright', value: 'playwright' },
          { name: 'Cypress', value: 'cypress' },
          { name: 'None', value: 'none' },
        ],
      },
    ]);
    e2eFramework = e2eAnswer.e2eFramework;
  }

  const { coverageTarget } = await inquirer.prompt<{
    coverageTarget: CoverageTarget;
  }>([
    {
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
    },
  ]);

  return {
    testingApproach,
    testFramework,
    e2eFramework,
    coverageTarget,
  };
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
