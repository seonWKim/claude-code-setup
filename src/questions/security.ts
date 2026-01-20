import inquirer from 'inquirer';
import type {
  SecurityLevel,
  AuthProvider,
  ProjectGoal,
  DatabaseClient,
} from '../types/index.js';
import { askWithGoBack, GoBackError, GO_BACK_CHOICE } from '../utils/wizard.js';

export interface SecurityAnswers {
  securityLevel: SecurityLevel;
  authProvider: AuthProvider;
  hasPayments: boolean;
  hasBlockchain: boolean;
}

export async function askSecurityQuestions(
  projectGoal: ProjectGoal,
  databaseClient: DatabaseClient,
  isFirstSection: boolean = false
): Promise<SecurityAnswers> {
  const defaultSecurityLevel: SecurityLevel =
    projectGoal === 'enterprise'
      ? 'high'
      : projectGoal === 'production'
        ? 'medium'
        : 'low';

  const questionKeys = ['securityLevel', 'authProvider', 'hasPayments', 'hasBlockchain'];
  let currentIndex = 0;
  const answers: Partial<SecurityAnswers> = {};

  while (currentIndex < questionKeys.length) {
    const isFirst = isFirstSection && currentIndex === 0;
    const questionKey = questionKeys[currentIndex];

    try {
      switch (questionKey) {
        case 'securityLevel': {
          answers.securityLevel = await askWithGoBack<SecurityLevel>({
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
          const authChoices: Array<{ name: string; value: AuthProvider }> = [];
          if (databaseClient === 'supabase') {
            authChoices.push({ name: 'Supabase Auth', value: 'supabase' });
          }
          authChoices.push(
            { name: 'NextAuth.js', value: 'nextauth' },
            { name: 'Clerk', value: 'clerk' },
            { name: 'Auth0', value: 'auth0' },
            { name: 'Custom implementation', value: 'custom' },
            { name: 'None / Not needed', value: 'none' }
          );

          answers.authProvider = await askWithGoBack<AuthProvider>({
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
            new inquirer.Separator(),
            GO_BACK_CHOICE,
          ];
          answers.hasPayments = await askWithGoBack<boolean>({
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
            new inquirer.Separator(),
            GO_BACK_CHOICE,
          ];
          answers.hasBlockchain = await askWithGoBack<boolean>({
            type: 'list',
            name: 'hasBlockchain',
            message: 'Will your app integrate with blockchain/Web3?',
            choices: blockchainChoices,
          }, true);
          break;
        }
      }

      currentIndex++;
    } catch (error) {
      if (error instanceof GoBackError) {
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  return answers as SecurityAnswers;
}
