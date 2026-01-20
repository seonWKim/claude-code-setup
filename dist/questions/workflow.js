"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askWorkflowQuestions = askWorkflowQuestions;
const inquirer_1 = __importDefault(require("inquirer"));
const wizard_js_1 = require("../utils/wizard.js");
async function askWorkflowQuestions(projectGoal, isFirstSection = false) {
    const questionKeys = ['teamSize', 'gitWorkflow', 'requireCodeReview', 'enableHooks'];
    let currentIndex = 0;
    const answers = {};
    while (currentIndex < questionKeys.length) {
        const isFirst = isFirstSection && currentIndex === 0;
        const questionKey = questionKeys[currentIndex];
        try {
            switch (questionKey) {
                case 'teamSize': {
                    answers.teamSize = await (0, wizard_js_1.askWithGoBack)({
                        type: 'list',
                        name: 'teamSize',
                        message: 'What is your team size?',
                        choices: [
                            { name: 'Solo developer', value: 'solo' },
                            { name: 'Small team (2-5)', value: 'small' },
                            { name: 'Medium team (6-15)', value: 'medium' },
                            { name: 'Large team (15+)', value: 'large' },
                        ],
                    }, isFirst);
                    break;
                }
                case 'gitWorkflow': {
                    answers.gitWorkflow = await (0, wizard_js_1.askWithGoBack)({
                        type: 'list',
                        name: 'gitWorkflow',
                        message: 'What git workflow do you follow?',
                        choices: [
                            { name: 'Feature branches (branch per feature/fix)', value: 'feature-branches' },
                            { name: 'Trunk-based (small, frequent commits to main)', value: 'trunk-based' },
                            { name: 'GitFlow (develop, release, hotfix branches)', value: 'gitflow' },
                        ],
                        default: answers.teamSize === 'solo' ? 'trunk-based' : 'feature-branches',
                    }, false);
                    break;
                }
                case 'requireCodeReview': {
                    const codeReviewChoices = [
                        { name: 'Yes', value: true },
                        { name: 'No', value: false },
                        new inquirer_1.default.Separator(),
                        wizard_js_1.GO_BACK_CHOICE,
                    ];
                    answers.requireCodeReview = await (0, wizard_js_1.askWithGoBack)({
                        type: 'list',
                        name: 'requireCodeReview',
                        message: 'Do you want Claude to follow code review guidelines?',
                        choices: codeReviewChoices,
                        default: answers.teamSize !== 'solo',
                    }, true);
                    break;
                }
                case 'enableHooks': {
                    const hooksChoices = [
                        { name: 'Yes', value: true },
                        { name: 'No', value: false },
                        new inquirer_1.default.Separator(),
                        wizard_js_1.GO_BACK_CHOICE,
                    ];
                    answers.enableHooks = await (0, wizard_js_1.askWithGoBack)({
                        type: 'list',
                        name: 'enableHooks',
                        message: 'Enable Claude Code hooks (auto-format, type-checking, git safeguards)?',
                        choices: hooksChoices,
                        default: projectGoal !== 'learning',
                    }, true);
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
    return answers;
}
//# sourceMappingURL=workflow.js.map