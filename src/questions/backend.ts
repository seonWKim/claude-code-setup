import inquirer from 'inquirer';
import type {
  BackendLanguage,
  BackendFramework,
  Database,
  DatabaseClient,
  ProjectType,
} from '../types/index.js';
import { askWithGoBack, GoBackError, GO_BACK_CHOICE } from '../utils/wizard.js';

export interface BackendAnswers {
  hasBackend: boolean;
  backendLanguage: BackendLanguage;
  backendFramework: BackendFramework;
  database: Database;
  databaseClient: DatabaseClient;
}

export async function askBackendQuestions(
  projectType: ProjectType,
  isFirstSection: boolean = false
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

  const questionKeys = ['hasBackend', 'backendLanguage', 'backendFramework', 'database', 'databaseClient'];
  let currentIndex = 0;
  const answers: Partial<BackendAnswers> = {};

  while (currentIndex < questionKeys.length) {
    const isFirst = isFirstSection && currentIndex === 0;
    const questionKey = questionKeys[currentIndex];

    try {
      switch (questionKey) {
        case 'hasBackend': {
          const hasBackendChoices = [
            { name: 'Yes', value: true },
            { name: 'No', value: false },
            ...(!isFirst ? [new inquirer.Separator(), GO_BACK_CHOICE] : []),
          ];
          const hasBackend = await askWithGoBack<boolean>({
            type: 'list',
            name: 'hasBackend',
            message: 'Does your project have a backend/API?',
            choices: hasBackendChoices,
          }, true);

          if (!hasBackend) {
            return {
              hasBackend: false,
              backendLanguage: 'none',
              backendFramework: 'none',
              database: 'none',
              databaseClient: 'none',
            };
          }
          answers.hasBackend = true;
          break;
        }

        case 'backendLanguage': {
          answers.backendLanguage = await askWithGoBack<BackendLanguage>({
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
          }, false);
          break;
        }

        case 'backendFramework': {
          answers.backendFramework = await askWithGoBack<BackendFramework>({
            type: 'list',
            name: 'backendFramework',
            message: 'Which backend framework are you using?',
            choices: getFrameworkChoices(answers.backendLanguage!),
          }, false);
          break;
        }

        case 'database': {
          answers.database = await askWithGoBack<Database>({
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
          }, false);
          break;
        }

        case 'databaseClient': {
          if (answers.database === 'none') {
            answers.databaseClient = 'none';
          } else {
            answers.databaseClient = await askWithGoBack<DatabaseClient>({
              type: 'list',
              name: 'databaseClient',
              message: 'What database client/ORM are you using?',
              choices: getDatabaseClientChoices(answers.backendLanguage!, answers.database!),
            }, false);
          }
          break;
        }
      }

      currentIndex++;
    } catch (error) {
      if (error instanceof GoBackError) {
        if (currentIndex > 0) {
          currentIndex--;
          // Skip databaseClient if database is none when going back
          if (questionKeys[currentIndex] === 'databaseClient' && answers.database === 'none') {
            currentIndex--;
          }
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  return answers as BackendAnswers;
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
