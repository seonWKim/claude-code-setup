"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askSecurityQuestions = askSecurityQuestions;
const inquirer_1 = __importDefault(require("inquirer"));
const wizard_js_1 = require("../utils/wizard.js");
async function askSecurityQuestions(projectGoal, databaseClient, isFirstSection = false) {
    const defaultSecurityLevel = projectGoal === 'enterprise'
        ? 'high'
        : projectGoal === 'production'
            ? 'medium'
            : 'low';
    const questionKeys = ['securityLevel', 'authProvider', 'hasPayments', 'hasBlockchain'];
    let currentIndex = 0;
    const answers = {};
    while (currentIndex < questionKeys.length) {
        const isFirst = isFirstSection && currentIndex === 0;
        const questionKey = questionKeys[currentIndex];
        try {
            switch (questionKey) {
                case 'securityLevel': {
                    answers.securityLevel = await (0, wizard_js_1.askWithGoBack)({
                        type: 'list',
                        name: 'securityLevel',
                        message: 'What security level does your project require?',
                        choices: [
                            { name: 'High (strict validation, security reviews required)', value: 'high' },
                            { name: 'Medium (standard best practices)', value: 'medium' },
                            { name: 'Low (learning/prototype, minimal restrictions)', value: 'low' },
                        ],
                        default: defaultSecurityLevel,
                    }, isFirst);
                    break;
                }
                case 'authProvider': {
                    const authChoices = [];
                    if (databaseClient === 'supabase') {
                        authChoices.push({ name: 'Supabase Auth', value: 'supabase' });
                    }
                    authChoices.push({ name: 'NextAuth.js', value: 'nextauth' }, { name: 'Clerk', value: 'clerk' }, { name: 'Auth0', value: 'auth0' }, { name: 'Custom implementation', value: 'custom' }, { name: 'None / Not needed', value: 'none' });
                    answers.authProvider = await (0, wizard_js_1.askWithGoBack)({
                        type: 'list',
                        name: 'authProvider',
                        message: 'What authentication provider are you using?',
                        choices: authChoices,
                    }, false);
                    break;
                }
                case 'hasPayments': {
                    const paymentsChoices = [
                        { name: 'Yes', value: true },
                        { name: 'No', value: false },
                        new inquirer_1.default.Separator(),
                        wizard_js_1.GO_BACK_CHOICE,
                    ];
                    answers.hasPayments = await (0, wizard_js_1.askWithGoBack)({
                        type: 'list',
                        name: 'hasPayments',
                        message: 'Will your app handle payments (Stripe, etc.)?',
                        choices: paymentsChoices,
                    }, true);
                    break;
                }
                case 'hasBlockchain': {
                    const blockchainChoices = [
                        { name: 'Yes', value: true },
                        { name: 'No', value: false },
                        new inquirer_1.default.Separator(),
                        wizard_js_1.GO_BACK_CHOICE,
                    ];
                    answers.hasBlockchain = await (0, wizard_js_1.askWithGoBack)({
                        type: 'list',
                        name: 'hasBlockchain',
                        message: 'Will your app integrate with blockchain/Web3?',
                        choices: blockchainChoices,
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
//# sourceMappingURL=security.js.map