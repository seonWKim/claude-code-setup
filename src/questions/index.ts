import inquirer from 'inquirer';
import type {
  UserAnswers,
  ProjectType,
  ProjectGoal,
  FrontendFramework,
  MetaFramework,
  StylingApproach,
  BackendLanguage,
  BackendFramework,
  Database,
  DatabaseClient,
  TestingApproach,
  TestFramework,
  E2EFramework,
  CoverageTarget,
  SecurityLevel,
  AuthProvider,
  DeploymentPlatform,
  CICDPlatform,
  TeamSize,
  GitWorkflow,
} from '../types/index.js';
import logger from '../utils/logger.js';
import { askWithGoBack, GoBackError, GO_BACK_CHOICE, GO_BACK_VALUE } from '../utils/wizard.js';

// Helper functions for dynamic choices
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

function getFrameworkChoices(language: BackendLanguage): Array<{ name: string; value: BackendFramework }> {
  switch (language) {
    case 'typescript':
      return [
        { name: 'Express', value: 'express' },
        { name: 'Fastify', value: 'fastify' },
        { name: 'NestJS', value: 'nestjs' },
        { name: 'Hono', value: 'hono' },
        { name: 'None (raw Node.js)', value: 'none' },
      ];
    case 'go':
      return [
        { name: 'Gin', value: 'gin' },
        { name: 'Standard library (net/http)', value: 'none' },
      ];
    case 'rust':
      return [
        { name: 'Axum', value: 'axum' },
        { name: 'None', value: 'none' },
      ];
    case 'java':
      return [
        { name: 'Spring Boot', value: 'spring' },
        { name: 'None', value: 'none' },
      ];
    case 'python':
      return [
        { name: 'FastAPI', value: 'fastapi' },
        { name: 'Django', value: 'django' },
        { name: 'None', value: 'none' },
      ];
    default:
      return [{ name: 'None', value: 'none' }];
  }
}

function getDatabaseClientChoices(language: BackendLanguage, database: Database): Array<{ name: string; value: DatabaseClient }> {
  const choices: Array<{ name: string; value: DatabaseClient }> = [];
  if (database === 'postgresql') {
    choices.push({ name: 'Supabase', value: 'supabase' });
  }
  if (language === 'typescript') {
    if (database !== 'mongodb') {
      choices.push(
        { name: 'Prisma', value: 'prisma' },
        { name: 'Drizzle', value: 'drizzle' },
        { name: 'TypeORM', value: 'typeorm' }
      );
    }
  }
  if (language === 'python') {
    choices.push({ name: 'SQLAlchemy', value: 'sqlalchemy' });
  }
  choices.push({ name: 'Raw SQL / Native driver', value: 'raw' });
  return choices;
}

function getTestFrameworkChoices(language: BackendLanguage): Array<{ name: string; value: TestFramework }> {
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

interface QuestionStep {
  key: string;
  section: string;
  sectionIndex: number;
  ask: (answers: Partial<UserAnswers>, isFirst: boolean) => Promise<unknown>;
  shouldSkip?: (answers: Partial<UserAnswers>) => boolean;
}

function buildQuestionSteps(): QuestionStep[] {
  const steps: QuestionStep[] = [];

  // Section 1: Project Configuration
  steps.push({
    key: 'projectName',
    section: 'Project Configuration',
    sectionIndex: 0,
    ask: async (_, isFirst) => askWithGoBack<string>({
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'my-project',
      validate: (input: string) => {
        if (input.toLowerCase() === 'back') return true;
        if (!input.trim()) return 'Project name is required';
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) return 'Project name can only contain letters, numbers, hyphens, and underscores';
        return true;
      },
    }, isFirst),
  });

  steps.push({
    key: 'projectType',
    section: 'Project Configuration',
    sectionIndex: 0,
    ask: async () => askWithGoBack<ProjectType>({
      type: 'list',
      name: 'projectType',
      message: 'What type of project is this?',
      choices: [
        { name: 'Full Stack Web Application', value: 'fullstack' },
        { name: 'Frontend Only (SPA/Static)', value: 'frontend' },
        { name: 'Backend/API Only', value: 'backend' },
        { name: 'Mobile Application', value: 'mobile' },
        { name: 'Library/Package', value: 'library' },
        { name: 'Monorepo (Multiple packages)', value: 'monorepo' },
      ],
    }, false),
  });

  steps.push({
    key: 'projectGoal',
    section: 'Project Configuration',
    sectionIndex: 0,
    ask: async () => askWithGoBack<ProjectGoal>({
      type: 'list',
      name: 'projectGoal',
      message: 'What is the primary goal of this project?',
      choices: [
        { name: 'MVP / Prototype (move fast)', value: 'mvp' },
        { name: 'Production Application (quality focus)', value: 'production' },
        { name: 'Learning / Experimentation', value: 'learning' },
        { name: 'Enterprise (compliance, scalability)', value: 'enterprise' },
      ],
    }, false),
  });

  // Section 2: Frontend Stack
  steps.push({
    key: 'hasFrontend',
    section: 'Frontend Stack',
    sectionIndex: 1,
    shouldSkip: (answers) => answers.projectType === 'backend',
    ask: async (answers) => {
      if (answers.projectType === 'backend') return false;
      const choices = [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
        new inquirer.Separator(),
        GO_BACK_CHOICE,
      ];
      return askWithGoBack<boolean>({
        type: 'list',
        name: 'hasFrontend',
        message: 'Does your project have a frontend?',
        choices,
      }, true);
    },
  });

  steps.push({
    key: 'frontendFramework',
    section: 'Frontend Stack',
    sectionIndex: 1,
    shouldSkip: (answers) => answers.projectType === 'backend' || !answers.hasFrontend,
    ask: async () => askWithGoBack<FrontendFramework>({
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
    }, false),
  });

  steps.push({
    key: 'metaFramework',
    section: 'Frontend Stack',
    sectionIndex: 1,
    shouldSkip: (answers) => answers.projectType === 'backend' || !answers.hasFrontend,
    ask: async (answers) => askWithGoBack<MetaFramework>({
      type: 'list',
      name: 'metaFramework',
      message: 'Are you using a meta-framework?',
      choices: getMetaFrameworkChoices(answers.frontendFramework!),
    }, false),
  });

  steps.push({
    key: 'stylingApproach',
    section: 'Frontend Stack',
    sectionIndex: 1,
    shouldSkip: (answers) => answers.projectType === 'backend' || !answers.hasFrontend,
    ask: async () => askWithGoBack<StylingApproach>({
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
    }, false),
  });

  // Section 3: Backend Stack
  steps.push({
    key: 'hasBackend',
    section: 'Backend Stack',
    sectionIndex: 2,
    shouldSkip: (answers) => answers.projectType === 'frontend',
    ask: async (answers) => {
      if (answers.projectType === 'frontend') return false;
      const choices = [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
        new inquirer.Separator(),
        GO_BACK_CHOICE,
      ];
      return askWithGoBack<boolean>({
        type: 'list',
        name: 'hasBackend',
        message: 'Does your project have a backend/API?',
        choices,
      }, true);
    },
  });

  steps.push({
    key: 'backendLanguage',
    section: 'Backend Stack',
    sectionIndex: 2,
    shouldSkip: (answers) => answers.projectType === 'frontend' || !answers.hasBackend,
    ask: async () => askWithGoBack<BackendLanguage>({
      type: 'list',
      name: 'backendLanguage',
      message: 'What is your primary backend language?',
      choices: [
        { name: 'TypeScript/JavaScript (Node.js)', value: 'typescript' },
        { name: 'Go', value: 'go' },
        { name: 'Rust', value: 'rust' },
        { name: 'Java/Kotlin', value: 'java' },
        { name: 'Python', value: 'python' },
      ],
    }, false),
  });

  steps.push({
    key: 'backendFramework',
    section: 'Backend Stack',
    sectionIndex: 2,
    shouldSkip: (answers) => answers.projectType === 'frontend' || !answers.hasBackend,
    ask: async (answers) => askWithGoBack<BackendFramework>({
      type: 'list',
      name: 'backendFramework',
      message: 'Which backend framework are you using?',
      choices: getFrameworkChoices(answers.backendLanguage!),
    }, false),
  });

  steps.push({
    key: 'database',
    section: 'Backend Stack',
    sectionIndex: 2,
    shouldSkip: (answers) => answers.projectType === 'frontend' || !answers.hasBackend,
    ask: async () => askWithGoBack<Database>({
      type: 'list',
      name: 'database',
      message: 'What database are you using?',
      choices: [
        { name: 'PostgreSQL', value: 'postgresql' },
        { name: 'MySQL', value: 'mysql' },
        { name: 'MongoDB', value: 'mongodb' },
        { name: 'SQLite', value: 'sqlite' },
        { name: 'None / Not decided yet', value: 'none' },
      ],
    }, false),
  });

  steps.push({
    key: 'databaseClient',
    section: 'Backend Stack',
    sectionIndex: 2,
    shouldSkip: (answers) => answers.projectType === 'frontend' || !answers.hasBackend || answers.database === 'none',
    ask: async (answers) => askWithGoBack<DatabaseClient>({
      type: 'list',
      name: 'databaseClient',
      message: 'What database client/ORM are you using?',
      choices: getDatabaseClientChoices(answers.backendLanguage!, answers.database!),
    }, false),
  });

  // Section 4: Testing Strategy
  steps.push({
    key: 'testingApproach',
    section: 'Testing Strategy',
    sectionIndex: 3,
    ask: async (answers) => askWithGoBack<TestingApproach>({
      type: 'list',
      name: 'testingApproach',
      message: 'What is your testing approach?',
      choices: [
        { name: 'TDD (Test-Driven Development)', value: 'tdd' },
        { name: 'Standard (write tests alongside code)', value: 'standard' },
        { name: 'Minimal (critical paths only)', value: 'minimal' },
        { name: 'None (skip testing setup)', value: 'none' },
      ],
      default: answers.projectGoal === 'enterprise' ? 'tdd' : 'standard',
    }, false),
  });

  steps.push({
    key: 'testFramework',
    section: 'Testing Strategy',
    sectionIndex: 3,
    shouldSkip: (answers) => answers.testingApproach === 'none',
    ask: async (answers) => askWithGoBack<TestFramework>({
      type: 'list',
      name: 'testFramework',
      message: 'Which test framework will you use?',
      choices: getTestFrameworkChoices(answers.backendLanguage || 'typescript'),
    }, false),
  });

  steps.push({
    key: 'e2eFramework',
    section: 'Testing Strategy',
    sectionIndex: 3,
    shouldSkip: (answers) => answers.testingApproach === 'none' || answers.testingApproach === 'minimal' || !answers.hasFrontend,
    ask: async () => askWithGoBack<E2EFramework>({
      type: 'list',
      name: 'e2eFramework',
      message: 'Do you want E2E testing?',
      choices: [
        { name: 'Playwright', value: 'playwright' },
        { name: 'Cypress', value: 'cypress' },
        { name: 'None', value: 'none' },
      ],
    }, false),
  });

  steps.push({
    key: 'coverageTarget',
    section: 'Testing Strategy',
    sectionIndex: 3,
    shouldSkip: (answers) => answers.testingApproach === 'none',
    ask: async (answers) => askWithGoBack<CoverageTarget>({
      type: 'list',
      name: 'coverageTarget',
      message: 'What is your target code coverage?',
      choices: [
        { name: '80% (high quality)', value: '80' },
        { name: '60% (balanced)', value: '60' },
        { name: '40% (essential coverage)', value: '40' },
        { name: 'No target', value: 'none' },
      ],
      default: answers.projectGoal === 'enterprise' ? '80' : '60',
    }, false),
  });

  // Section 5: Security
  steps.push({
    key: 'securityLevel',
    section: 'Security',
    sectionIndex: 4,
    ask: async (answers) => askWithGoBack<SecurityLevel>({
      type: 'list',
      name: 'securityLevel',
      message: 'What security level does your project require?',
      choices: [
        { name: 'High (strict validation, security reviews required)', value: 'high' },
        { name: 'Medium (standard best practices)', value: 'medium' },
        { name: 'Low (learning/prototype, minimal restrictions)', value: 'low' },
      ],
      default: answers.projectGoal === 'enterprise' ? 'high' : answers.projectGoal === 'production' ? 'medium' : 'low',
    }, false),
  });

  steps.push({
    key: 'authProvider',
    section: 'Security',
    sectionIndex: 4,
    ask: async (answers) => {
      const authChoices: Array<{ name: string; value: AuthProvider }> = [];
      if (answers.databaseClient === 'supabase') {
        authChoices.push({ name: 'Supabase Auth', value: 'supabase' });
      }
      authChoices.push(
        { name: 'NextAuth.js', value: 'nextauth' },
        { name: 'Clerk', value: 'clerk' },
        { name: 'Auth0', value: 'auth0' },
        { name: 'Custom implementation', value: 'custom' },
        { name: 'None / Not needed', value: 'none' }
      );
      return askWithGoBack<AuthProvider>({
        type: 'list',
        name: 'authProvider',
        message: 'What authentication provider are you using?',
        choices: authChoices,
      }, false);
    },
  });

  steps.push({
    key: 'hasPayments',
    section: 'Security',
    sectionIndex: 4,
    ask: async () => {
      const choices = [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
        new inquirer.Separator(),
        GO_BACK_CHOICE,
      ];
      return askWithGoBack<boolean>({
        type: 'list',
        name: 'hasPayments',
        message: 'Will your app handle payments (Stripe, etc.)?',
        choices,
      }, true);
    },
  });

  steps.push({
    key: 'hasBlockchain',
    section: 'Security',
    sectionIndex: 4,
    ask: async () => {
      const choices = [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
        new inquirer.Separator(),
        GO_BACK_CHOICE,
      ];
      return askWithGoBack<boolean>({
        type: 'list',
        name: 'hasBlockchain',
        message: 'Will your app integrate with blockchain/Web3?',
        choices,
      }, true);
    },
  });

  // Section 6: DevOps & Integrations
  steps.push({
    key: 'deploymentPlatform',
    section: 'DevOps & Integrations',
    sectionIndex: 5,
    ask: async () => askWithGoBack<DeploymentPlatform>({
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
    }, false),
  });

  steps.push({
    key: 'cicdPlatform',
    section: 'DevOps & Integrations',
    sectionIndex: 5,
    ask: async () => askWithGoBack<CICDPlatform>({
      type: 'list',
      name: 'cicdPlatform',
      message: 'What CI/CD platform will you use?',
      choices: [
        { name: 'GitHub Actions', value: 'github-actions' },
        { name: 'GitLab CI', value: 'gitlab-ci' },
        { name: 'None / Not needed', value: 'none' },
      ],
    }, false),
  });

  steps.push({
    key: 'mcpIntegrations',
    section: 'DevOps & Integrations',
    sectionIndex: 5,
    ask: async (answers) => {
      const mcpChoices: Array<{ name: string; value: string }> = [
        { name: 'GitHub (PRs, issues, repos)', value: 'github' },
        { name: 'Context7 (live documentation)', value: 'context7' },
        { name: 'Sequential Thinking (reasoning)', value: 'sequential-thinking' },
        { name: 'Memory (persistent memory)', value: 'memory' },
        { name: 'Firecrawl (web scraping)', value: 'firecrawl' },
        { name: 'Magic UI (UI components)', value: 'magic' },
      ];
      if (answers.databaseClient === 'supabase') {
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
      mcpChoices.push(
        new inquirer.Separator() as unknown as { name: string; value: string },
        GO_BACK_CHOICE
      );

      const result = await inquirer.prompt<{ mcpIntegrations: string[] }>([{
        type: 'checkbox',
        name: 'mcpIntegrations',
        message: 'Which MCP integrations would you like to enable? (space to select)',
        choices: mcpChoices,
        default: ['github', 'context7'],
      }]);

      if (result.mcpIntegrations.includes(GO_BACK_VALUE)) {
        throw new GoBackError();
      }
      return result.mcpIntegrations;
    },
  });

  // Section 7: Workflow
  steps.push({
    key: 'teamSize',
    section: 'Workflow',
    sectionIndex: 6,
    ask: async () => askWithGoBack<TeamSize>({
      type: 'list',
      name: 'teamSize',
      message: 'What is your team size?',
      choices: [
        { name: 'Solo developer', value: 'solo' },
        { name: 'Small team (2-5)', value: 'small' },
        { name: 'Medium team (6-15)', value: 'medium' },
        { name: 'Large team (15+)', value: 'large' },
      ],
    }, false),
  });

  steps.push({
    key: 'gitWorkflow',
    section: 'Workflow',
    sectionIndex: 6,
    ask: async (answers) => askWithGoBack<GitWorkflow>({
      type: 'list',
      name: 'gitWorkflow',
      message: 'What git workflow do you follow?',
      choices: [
        { name: 'Feature branches (branch per feature/fix)', value: 'feature-branches' },
        { name: 'Trunk-based (small, frequent commits to main)', value: 'trunk-based' },
        { name: 'GitFlow (develop, release, hotfix branches)', value: 'gitflow' },
      ],
      default: answers.teamSize === 'solo' ? 'trunk-based' : 'feature-branches',
    }, false),
  });

  steps.push({
    key: 'requireCodeReview',
    section: 'Workflow',
    sectionIndex: 6,
    ask: async (answers) => {
      const choices = [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
        new inquirer.Separator(),
        GO_BACK_CHOICE,
      ];
      return askWithGoBack<boolean>({
        type: 'list',
        name: 'requireCodeReview',
        message: 'Do you want Claude to follow code review guidelines?',
        choices,
        default: answers.teamSize !== 'solo',
      }, true);
    },
  });

  steps.push({
    key: 'enableHooks',
    section: 'Workflow',
    sectionIndex: 6,
    ask: async (answers) => {
      const choices = [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
        new inquirer.Separator(),
        GO_BACK_CHOICE,
      ];
      return askWithGoBack<boolean>({
        type: 'list',
        name: 'enableHooks',
        message: 'Enable Claude Code hooks (auto-format, type-checking, git safeguards)?',
        choices,
        default: answers.projectGoal !== 'learning',
      }, true);
    },
  });

  return steps;
}

export async function askAllQuestions(): Promise<UserAnswers> {
  const steps = buildQuestionSteps();
  const answers: Partial<UserAnswers> = {};
  let currentStep = 0;
  let lastSection = -1;

  while (currentStep < steps.length) {
    const step = steps[currentStep];

    // Show section header when entering a new section
    if (step.sectionIndex !== lastSection) {
      logger.newline();
      logger.title(`${step.section} (${step.sectionIndex + 1}/7)`);
      logger.newline();
      lastSection = step.sectionIndex;
    }

    // Check if this step should be skipped
    if (step.shouldSkip?.(answers)) {
      currentStep++;
      continue;
    }

    const isFirstStep = currentStep === 0;

    try {
      const answer = await step.ask(answers, isFirstStep);
      answers[step.key as keyof UserAnswers] = answer as never;
      currentStep++;
    } catch (error) {
      if (error instanceof GoBackError) {
        // Find previous non-skipped step
        let prevStep = currentStep - 1;
        while (prevStep >= 0) {
          const prev = steps[prevStep];
          if (!prev.shouldSkip?.(answers)) {
            break;
          }
          prevStep--;
        }

        if (prevStep >= 0) {
          currentStep = prevStep;
          // Update section header tracking
          lastSection = steps[prevStep].sectionIndex - 1;
        }
        // If at first step, just stay there
      } else {
        throw error;
      }
    }
  }

  // Set defaults for skipped fields
  if (answers.projectType === 'backend') {
    answers.hasFrontend = false;
    answers.frontendFramework = 'none';
    answers.metaFramework = 'none';
    answers.stylingApproach = 'vanilla-css';
  }
  if (answers.projectType === 'frontend' || !answers.hasBackend) {
    answers.hasBackend = false;
    answers.backendLanguage = 'none';
    answers.backendFramework = 'none';
    answers.database = 'none';
    answers.databaseClient = 'none';
  }
  if (answers.database === 'none') {
    answers.databaseClient = 'none';
  }
  if (answers.testingApproach === 'none') {
    answers.testFramework = 'none';
    answers.e2eFramework = 'none';
    answers.coverageTarget = 'none';
  }
  if (!answers.e2eFramework) {
    answers.e2eFramework = 'none';
  }

  return answers as UserAnswers;
}

export { askSetupQuestions, cleanExistingClaudeFiles } from './setup.js';
