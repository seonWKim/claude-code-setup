import inquirer from 'inquirer';
import type {
  BackendLanguage,
  BackendFramework,
  Database,
  DatabaseClient,
  ProjectType,
} from '../types/index.js';

export interface BackendAnswers {
  hasBackend: boolean;
  backendLanguage: BackendLanguage;
  backendFramework: BackendFramework;
  database: Database;
  databaseClient: DatabaseClient;
}

export async function askBackendQuestions(
  projectType: ProjectType
): Promise<BackendAnswers> {
  // Skip backend questions for frontend-only projects
  if (projectType === 'frontend') {
    return {
      hasBackend: false,
      backendLanguage: 'none',
      backendFramework: 'none',
      database: 'none',
      databaseClient: 'none',
    };
  }

  const { hasBackend } = await inquirer.prompt<{ hasBackend: boolean }>([
    {
      type: 'confirm',
      name: 'hasBackend',
      message: 'Does your project have a backend/API?',
      default: true,
    },
  ]);

  if (!hasBackend) {
    return {
      hasBackend: false,
      backendLanguage: 'none',
      backendFramework: 'none',
      database: 'none',
      databaseClient: 'none',
    };
  }

  const { backendLanguage } = await inquirer.prompt<{
    backendLanguage: BackendLanguage;
  }>([
    {
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
    },
  ]);

  const frameworkChoices = getFrameworkChoices(backendLanguage);

  const { backendFramework } = await inquirer.prompt<{
    backendFramework: BackendFramework;
  }>([
    {
      type: 'list',
      name: 'backendFramework',
      message: 'Which backend framework are you using?',
      choices: frameworkChoices,
    },
  ]);

  const { database } = await inquirer.prompt<{ database: Database }>([
    {
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
    },
  ]);

  let databaseClient: DatabaseClient = 'none';

  if (database !== 'none') {
    const clientChoices = getDatabaseClientChoices(backendLanguage, database);

    const clientAnswer = await inquirer.prompt<{
      databaseClient: DatabaseClient;
    }>([
      {
        type: 'list',
        name: 'databaseClient',
        message: 'What database client/ORM are you using?',
        choices: clientChoices,
      },
    ]);

    databaseClient = clientAnswer.databaseClient;
  }

  return {
    hasBackend: true,
    backendLanguage,
    backendFramework,
    database,
    databaseClient,
  };
}

function getFrameworkChoices(
  language: BackendLanguage
): Array<{ name: string; value: BackendFramework }> {
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

function getDatabaseClientChoices(
  language: BackendLanguage,
  database: Database
): Array<{ name: string; value: DatabaseClient }> {
  const choices: Array<{ name: string; value: DatabaseClient }> = [];

  // Supabase is special - it's PostgreSQL with extra features
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
