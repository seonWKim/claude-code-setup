"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askWorkflowQuestions = askWorkflowQuestions;
const inquirer_1 = __importDefault(require("inquirer"));
async function askWorkflowQuestions(projectGoal) {
    const { teamSize } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'teamSize',
            message: 'What is your team size?',
            choices: [
                { name: 'Solo developer', value: 'solo' },
                { name: 'Small team (2-5)', value: 'small' },
                { name: 'Medium team (6-15)', value: 'medium' },
                { name: 'Large team (15+)', value: 'large' },
            ],
        },
    ]);
    const { gitWorkflow } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'gitWorkflow',
            message: 'What git workflow do you follow?',
            choices: [
                {
                    name: 'Feature branches (branch per feature/fix)',
                    value: 'feature-branches',
                },
                {
                    name: 'Trunk-based (small, frequent commits to main)',
                    value: 'trunk-based',
                },
                {
                    name: 'GitFlow (develop, release, hotfix branches)',
                    value: 'gitflow',
                },
            ],
            default: teamSize === 'solo' ? 'trunk-based' : 'feature-branches',
        },
    ]);
    const { requireCodeReview } = await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'requireCodeReview',
            message: 'Do you want Claude to follow code review guidelines?',
            default: teamSize !== 'solo',
        },
    ]);
    const { enableHooks } = await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'enableHooks',
            message: 'Enable Claude Code hooks (auto-format, type-checking, git safeguards)?',
            default: projectGoal !== 'learning',
        },
    ]);
    return {
        teamSize,
        gitWorkflow,
        requireCodeReview,
        enableHooks,
    };
}
//# sourceMappingURL=workflow.js.map