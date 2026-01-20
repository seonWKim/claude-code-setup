"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoBackError = exports.GO_BACK_CHOICE = exports.GO_BACK_VALUE = exports.GO_BACK = void 0;
exports.addGoBackToChoices = addGoBackToChoices;
exports.wrapValidatorWithGoBack = wrapValidatorWithGoBack;
exports.isGoBack = isGoBack;
exports.askWithGoBack = askWithGoBack;
exports.askQuestionsWithGoBack = askQuestionsWithGoBack;
const inquirer_1 = __importDefault(require("inquirer"));
exports.GO_BACK = Symbol('GO_BACK');
exports.GO_BACK_VALUE = '__GO_BACK__';
exports.GO_BACK_CHOICE = { name: '← Go back', value: exports.GO_BACK_VALUE };
class GoBackError extends Error {
    constructor() {
        super('GO_BACK');
        this.name = 'GoBackError';
    }
}
exports.GoBackError = GoBackError;
/**
 * Adds "Go back" option to list/checkbox questions
 */
function addGoBackToChoices(question, isFirstQuestion = false) {
    if (isFirstQuestion) {
        return question;
    }
    if (question.choices && Array.isArray(question.choices)) {
        return {
            ...question,
            choices: [...question.choices, new inquirer_1.default.Separator(), exports.GO_BACK_CHOICE],
        };
    }
    return question;
}
/**
 * Wraps an input validator to also accept "back" command
 */
function wrapValidatorWithGoBack(validator, isFirstQuestion = false) {
    return async (input) => {
        if (!isFirstQuestion && input.toLowerCase() === 'back') {
            return true; // Allow "back" as valid input
        }
        if (validator) {
            return validator(input);
        }
        return true;
    };
}
/**
 * Check if answer indicates go back
 */
function isGoBack(value) {
    return value === exports.GO_BACK_VALUE || (typeof value === 'string' && value.toLowerCase() === 'back');
}
/**
 * Ask a single question with go back support
 * Returns the answer or throws GoBackError
 */
async function askWithGoBack(question, isFirstQuestion = false) {
    let modifiedQuestion = { ...question };
    // Add go back to list choices
    if ((question.type === 'list' || question.type === 'checkbox') &&
        !isFirstQuestion) {
        modifiedQuestion = addGoBackToChoices(modifiedQuestion, isFirstQuestion);
    }
    // Add hint for input questions
    if (question.type === 'input' && !isFirstQuestion) {
        const originalMessage = question.message;
        modifiedQuestion.message = `${originalMessage} (type "back" to go back)`;
        modifiedQuestion.validate = wrapValidatorWithGoBack(question.validate, isFirstQuestion);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const answers = await inquirer_1.default.prompt([modifiedQuestion]);
    const answer = answers[question.name];
    if (isGoBack(answer)) {
        throw new GoBackError();
    }
    return answer;
}
/**
 * Ask multiple questions with go back support
 * If user goes back, throws GoBackError
 */
async function askQuestionsWithGoBack(questions, isFirstSection = false) {
    const answers = {};
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const isFirstQuestion = isFirstSection && i === 0;
        try {
            const answer = await askWithGoBack({ ...question, name: question.name }, isFirstQuestion);
            answers[question.name] = answer;
        }
        catch (error) {
            if (error instanceof GoBackError) {
                if (i > 0) {
                    // Go back to previous question in this section
                    i -= 2; // -2 because loop will increment
                    continue;
                }
                else {
                    // Go back to previous section
                    throw error;
                }
            }
            throw error;
        }
    }
    return answers;
}
//# sourceMappingURL=wizard.js.map