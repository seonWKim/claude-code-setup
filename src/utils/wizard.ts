import inquirer, { Answers } from 'inquirer';

// Use a flexible question type that supports all inquirer question properties
type AnyQuestion = {
  type?: string;
  name?: string;
  message?: string;
  choices?: unknown[];
  default?: unknown;
  validate?: (input: string) => boolean | string | Promise<boolean | string>;
  [key: string]: unknown;
};

export const GO_BACK = Symbol('GO_BACK');
export const GO_BACK_VALUE = '__GO_BACK__';
export const GO_BACK_CHOICE = { name: '← Go back', value: GO_BACK_VALUE };

export class GoBackError extends Error {
  constructor() {
    super('GO_BACK');
    this.name = 'GoBackError';
  }
}

/**
 * Adds "Go back" option to list/checkbox questions
 */
export function addGoBackToChoices(
  question: AnyQuestion,
  isFirstQuestion: boolean = false
): AnyQuestion {
  if (isFirstQuestion) {
    return question;
  }

  if (question.choices && Array.isArray(question.choices)) {
    return {
      ...question,
      choices: [...question.choices, new inquirer.Separator(), GO_BACK_CHOICE],
    };
  }

  return question;
}

/**
 * Wraps an input validator to also accept "back" command
 */
export function wrapValidatorWithGoBack(
  validator?: (input: string) => boolean | string | Promise<boolean | string>,
  isFirstQuestion: boolean = false
): (input: string) => boolean | string | Promise<boolean | string> {
  return async (input: string) => {
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
export function isGoBack(value: unknown): boolean {
  return value === GO_BACK_VALUE || (typeof value === 'string' && value.toLowerCase() === 'back');
}

/**
 * Ask a single question with go back support
 * Returns the answer or throws GoBackError
 */
export async function askWithGoBack<T>(
  question: AnyQuestion,
  isFirstQuestion: boolean = false
): Promise<T> {
  let modifiedQuestion = { ...question };

  // Add go back to list choices
  if (
    (question.type === 'list' || question.type === 'checkbox') &&
    !isFirstQuestion
  ) {
    modifiedQuestion = addGoBackToChoices(modifiedQuestion, isFirstQuestion);
  }

  // Add hint for input questions
  if (question.type === 'input' && !isFirstQuestion) {
    const originalMessage = question.message as string;
    modifiedQuestion.message = `${originalMessage} (type "back" to go back)`;
    modifiedQuestion.validate = wrapValidatorWithGoBack(
      question.validate as (input: string) => boolean | string | Promise<boolean | string>,
      isFirstQuestion
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const answers = await inquirer.prompt([modifiedQuestion as any]);
  const answer = answers[question.name as string];

  if (isGoBack(answer)) {
    throw new GoBackError();
  }

  return answer as T;
}

/**
 * Ask multiple questions with go back support
 * If user goes back, throws GoBackError
 */
export async function askQuestionsWithGoBack<T extends Answers>(
  questions: AnyQuestion[],
  isFirstSection: boolean = false
): Promise<T> {
  const answers: Partial<T> = {};

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const isFirstQuestion = isFirstSection && i === 0;

    try {
      const answer = await askWithGoBack(
        { ...question, name: question.name },
        isFirstQuestion
      );
      answers[question.name as keyof T] = answer as T[keyof T];
    } catch (error) {
      if (error instanceof GoBackError) {
        if (i > 0) {
          // Go back to previous question in this section
          i -= 2; // -2 because loop will increment
          continue;
        } else {
          // Go back to previous section
          throw error;
        }
      }
      throw error;
    }
  }

  return answers as T;
}
