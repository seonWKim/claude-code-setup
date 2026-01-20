"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askBackendQuestions = askBackendQuestions;
const inquirer_1 = __importDefault(require("inquirer"));
async function askBackendQuestions(projectType) {
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
    const { hasBackend } = await inquirer_1.default.prompt([
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
    const { backendLanguage } = await inquirer_1.default.prompt([
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
    const { backendFramework } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'backendFramework',
            message: 'Which backend framework are you using?',
            choices: frameworkChoices,
        },
    ]);
    const { database } = await inquirer_1.default.prompt([
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
    let databaseClient = 'none';
    if (database !== 'none') {
        const clientChoices = getDatabaseClientChoices(backendLanguage, database);
        const clientAnswer = await inquirer_1.default.prompt([
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
function getFrameworkChoices(language) {
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
function getDatabaseClientChoices(language, database) {
    const choices = [];
    // Supabase is special - it's PostgreSQL with extra features
    if (database === 'postgresql') {
        choices.push({ name: 'Supabase', value: 'supabase' });
    }
    if (language === 'typescript') {
        if (database !== 'mongodb') {
            choices.push({ name: 'Prisma', value: 'prisma' }, { name: 'Drizzle', value: 'drizzle' }, { name: 'TypeORM', value: 'typeorm' });
        }
    }
    if (language === 'python') {
        choices.push({ name: 'SQLAlchemy', value: 'sqlalchemy' });
    }
    choices.push({ name: 'Raw SQL / Native driver', value: 'raw' });
    return choices;
}
//# sourceMappingURL=backend.js.map