"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askBackendQuestions = askBackendQuestions;
const inquirer_1 = __importDefault(require("inquirer"));
const wizard_js_1 = require("../utils/wizard.js");
async function askBackendQuestions(projectType, isFirstSection = false) {
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
    const answers = {};
    while (currentIndex < questionKeys.length) {
        const isFirst = isFirstSection && currentIndex === 0;
        const questionKey = questionKeys[currentIndex];
        try {
            switch (questionKey) {
                case 'hasBackend': {
                    const hasBackendChoices = [
                        { name: 'Yes', value: true },
                        { name: 'No', value: false },
                        ...(!isFirst ? [new inquirer_1.default.Separator(), wizard_js_1.GO_BACK_CHOICE] : []),
                    ];
                    const hasBackend = await (0, wizard_js_1.askWithGoBack)({
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
                    answers.backendLanguage = await (0, wizard_js_1.askWithGoBack)({
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
                    answers.backendFramework = await (0, wizard_js_1.askWithGoBack)({
                        type: 'list',
                        name: 'backendFramework',
                        message: 'Which backend framework are you using?',
                        choices: getFrameworkChoices(answers.backendLanguage),
                    }, false);
                    break;
                }
                case 'database': {
                    answers.database = await (0, wizard_js_1.askWithGoBack)({
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
                    }
                    else {
                        answers.databaseClient = await (0, wizard_js_1.askWithGoBack)({
                            type: 'list',
                            name: 'databaseClient',
                            message: 'What database client/ORM are you using?',
                            choices: getDatabaseClientChoices(answers.backendLanguage, answers.database),
                        }, false);
                    }
                    break;
                }
            }
            currentIndex++;
        }
        catch (error) {
            if (error instanceof wizard_js_1.GoBackError) {
                if (currentIndex > 0) {
                    currentIndex--;
                    // Skip databaseClient if database is none when going back
                    if (questionKeys[currentIndex] === 'databaseClient' && answers.database === 'none') {
                        currentIndex--;
                    }
                }
                else {
                    throw error;
                }
            }
            else {
                throw error;
            }
        }
    }
    return answers;
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