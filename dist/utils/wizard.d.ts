import { Answers } from 'inquirer';
type AnyQuestion = {
    type?: string;
    name?: string;
    message?: string;
    choices?: unknown[];
    default?: unknown;
    validate?: (input: string) => boolean | string | Promise<boolean | string>;
    [key: string]: unknown;
};
export declare const GO_BACK: unique symbol;
export declare const GO_BACK_VALUE = "__GO_BACK__";
export declare const GO_BACK_CHOICE: {
    name: string;
    value: string;
};
export declare class GoBackError extends Error {
    constructor();
}
/**
 * Adds "Go back" option to list/checkbox questions
 */
export declare function addGoBackToChoices(question: AnyQuestion, isFirstQuestion?: boolean): AnyQuestion;
/**
 * Wraps an input validator to also accept "back" command
 */
export declare function wrapValidatorWithGoBack(validator?: (input: string) => boolean | string | Promise<boolean | string>, isFirstQuestion?: boolean): (input: string) => boolean | string | Promise<boolean | string>;
/**
 * Check if answer indicates go back
 */
export declare function isGoBack(value: unknown): boolean;
/**
 * Ask a single question with go back support
 * Returns the answer or throws GoBackError
 */
export declare function askWithGoBack<T>(question: AnyQuestion, isFirstQuestion?: boolean): Promise<T>;
/**
 * Ask multiple questions with go back support
 * If user goes back, throws GoBackError
 */
export declare function askQuestionsWithGoBack<T extends Answers>(questions: AnyQuestion[], isFirstSection?: boolean): Promise<T>;
export {};
//# sourceMappingURL=wizard.d.ts.map