import inquirer from 'inquirer';
import type {
  SecurityLevel,
  AuthProvider,
  ProjectGoal,
  DatabaseClient,
} from '../types/index.js';

export interface SecurityAnswers {
  securityLevel: SecurityLevel;
  authProvider: AuthProvider;
  hasPayments: boolean;
  hasBlockchain: boolean;
}

export async function askSecurityQuestions(
  projectGoal: ProjectGoal,
  databaseClient: DatabaseClient
): Promise<SecurityAnswers> {
  const defaultSecurityLevel: SecurityLevel =
    projectGoal === 'enterprise'
      ? 'high'
      : projectGoal === 'production'
        ? 'medium'
        : 'low';

  const { securityLevel } = await inquirer.prompt<{
    securityLevel: SecurityLevel;
  }>([
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

  const authChoices: Array<{ name: string; value: AuthProvider }> = [];

  // Add Supabase Auth if using Supabase
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

  const { authProvider } = await inquirer.prompt<{ authProvider: AuthProvider }>(
    [
      {
        type: 'list',
        name: 'authProvider',
        message: 'What authentication provider are you using?',
        choices: authChoices,
      },
    ]
  );

  const { hasPayments } = await inquirer.prompt<{ hasPayments: boolean }>([
    {
      type: 'confirm',
      name: 'hasPayments',
      message: 'Will your app handle payments (Stripe, etc.)?',
      default: false,
    },
  ]);

  const { hasBlockchain } = await inquirer.prompt<{ hasBlockchain: boolean }>([
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
