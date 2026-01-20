"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askTestingQuestions = askTestingQuestions;
const inquirer_1 = __importDefault(require("inquirer"));
async function askTestingQuestions(backendLanguage, projectGoal, hasFrontend) {
    const { testingApproach } = await inquirer_1.default.prompt([
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
    const { testFramework } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'testFramework',
            message: 'Which test framework will you use?',
            choices: testFrameworkChoices,
        },
    ]);
    let e2eFramework = 'none';
    if (hasFrontend && testingApproach !== 'minimal') {
        const e2eAnswer = await inquirer_1.default.prompt([
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
    const { coverageTarget } = await inquirer_1.default.prompt([
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
function getTestFrameworkChoices(language) {
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
//# sourceMappingURL=testing.js.map