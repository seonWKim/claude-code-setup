"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askSecurityQuestions = askSecurityQuestions;
const inquirer_1 = __importDefault(require("inquirer"));
async function askSecurityQuestions(projectGoal, databaseClient) {
    const defaultSecurityLevel = projectGoal === 'enterprise'
        ? 'high'
        : projectGoal === 'production'
            ? 'medium'
            : 'low';
    const { securityLevel } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'securityLevel',
            message: 'What security level does your project require?',
            choices: [
                {
                    name: 'High (strict validation, security reviews required)',
                    value: 'high',
                },
                {
                    name: 'Medium (standard best practices)',
                    value: 'medium',
                },
                {
                    name: 'Low (learning/prototype, minimal restrictions)',
                    value: 'low',
                },
            ],
            default: defaultSecurityLevel,
        },
    ]);
    const authChoices = [];
    // Add Supabase Auth if using Supabase
    if (databaseClient === 'supabase') {
        authChoices.push({ name: 'Supabase Auth', value: 'supabase' });
    }
    authChoices.push({ name: 'NextAuth.js', value: 'nextauth' }, { name: 'Clerk', value: 'clerk' }, { name: 'Auth0', value: 'auth0' }, { name: 'Custom implementation', value: 'custom' }, { name: 'None / Not needed', value: 'none' });
    const { authProvider } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'authProvider',
            message: 'What authentication provider are you using?',
            choices: authChoices,
        },
    ]);
    const { hasPayments } = await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'hasPayments',
            message: 'Will your app handle payments (Stripe, etc.)?',
            default: false,
        },
    ]);
    const { hasBlockchain } = await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'hasBlockchain',
            message: 'Will your app integrate with blockchain/Web3?',
            default: false,
        },
    ]);
    return {
        securityLevel,
        authProvider,
        hasPayments,
        hasBlockchain,
    };
}
//# sourceMappingURL=security.js.map