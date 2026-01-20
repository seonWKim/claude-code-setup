"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askTestingQuestions = askTestingQuestions;
const wizard_js_1 = require("../utils/wizard.js");
async function askTestingQuestions(backendLanguage, projectGoal, hasFrontend, isFirstSection = false) {
    // Build question keys dynamically based on conditions
    const getQuestionKeys = (answers) => {
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
    const answers = {};
    while (true) {
        const questionKeys = getQuestionKeys(answers);
        if (currentIndex >= questionKeys.length)
            break;
        const isFirst = isFirstSection && currentIndex === 0;
        const questionKey = questionKeys[currentIndex];
        try {
            switch (questionKey) {
                case 'testingApproach': {
                    const result = await (0, wizard_js_1.askWithGoBack)({
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
                    answers.testFramework = await (0, wizard_js_1.askWithGoBack)({
                        type: 'list',
                        name: 'testFramework',
                        message: 'Which test framework will you use?',
                        choices: getTestFrameworkChoices(backendLanguage),
                    }, false);
                    break;
                }
                case 'e2eFramework': {
                    answers.e2eFramework = await (0, wizard_js_1.askWithGoBack)({
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
                    answers.coverageTarget = await (0, wizard_js_1.askWithGoBack)({
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
        }
        catch (error) {
            if (error instanceof wizard_js_1.GoBackError) {
                if (currentIndex > 0) {
                    currentIndex--;
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
    // Set defaults for skipped questions
    if (!answers.e2eFramework) {
        answers.e2eFramework = 'none';
    }
    return answers;
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