"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectQuestions = void 0;
exports.askProjectQuestions = askProjectQuestions;
const wizard_js_1 = require("../utils/wizard.js");
exports.projectQuestions = [
    {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: 'my-project',
        validate: (input) => {
            if (!input.trim()) {
                return 'Project name is required';
            }
            if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
                return 'Project name can only contain letters, numbers, hyphens, and underscores';
            }
            return true;
        },
    },
    {
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
    },
    {
        type: 'list',
        name: 'projectGoal',
        message: 'What is the primary goal of this project?',
        choices: [
            { name: 'MVP / Prototype (move fast)', value: 'mvp' },
            { name: 'Production Application (quality focus)', value: 'production' },
            { name: 'Learning / Experimentation', value: 'learning' },
            { name: 'Enterprise (compliance, scalability)', value: 'enterprise' },
        ],
    },
];
async function askProjectQuestions(isFirstSection = true) {
    return (0, wizard_js_1.askQuestionsWithGoBack)(exports.projectQuestions, isFirstSection);
}
//# sourceMappingURL=project.js.map