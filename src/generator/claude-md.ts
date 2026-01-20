import ejs from 'ejs';
import fs from 'fs-extra';
import path from 'path';
import type { UserAnswers, SelectedComponents } from '../types/index.js';
import spinner from '../utils/spinner.js';

// Get the templates directory relative to the package root
function getTemplatesDir(): string {
  // When running from dist/, we need to go up to the package root
  // __dirname in CommonJS will be dist/generator/
  const distDir = __dirname;
  const packageRoot = path.resolve(distDir, '../..');
  return path.join(packageRoot, 'templates');
}

export async function generateClaudeMd(
  targetDir: string,
  answers: UserAnswers,
  components: SelectedComponents
): Promise<void> {
  spinner.start('Generating CLAUDE.md...');

  const templatePath = path.join(getTemplatesDir(), 'CLAUDE.md.ejs');
  const template = await fs.readFile(templatePath, 'utf-8');

  const content = ejs.render(template, {
    answers,
    components,
    getTechStackSummary,
    getAvailableCommands,
    getCriticalRules,
  });

  await fs.writeFile(path.join(targetDir, 'CLAUDE.md'), content.trim() + '\n');

  spinner.succeed('Generated CLAUDE.md');
}

function getTechStackSummary(answers: UserAnswers): string[] {
  const stack: string[] = [];

  if (answers.hasFrontend) {
    let frontend: string = answers.frontendFramework;
    if (answers.metaFramework !== 'none') {
      frontend = answers.metaFramework;
    }
    stack.push(`Frontend: ${frontend}`);
    if (answers.stylingApproach !== 'vanilla-css') {
      stack.push(`Styling: ${answers.stylingApproach}`);
    }
  }

  if (answers.hasBackend) {
    stack.push(`Backend: ${answers.backendLanguage}`);
    if (answers.backendFramework !== 'none') {
      stack.push(`Framework: ${answers.backendFramework}`);
    }
    if (answers.database !== 'none') {
      stack.push(`Database: ${answers.database}`);
    }
    if (answers.databaseClient !== 'none' && answers.databaseClient !== 'raw') {
      stack.push(`ORM/Client: ${answers.databaseClient}`);
    }
  }

  if (answers.testFramework !== 'none') {
    stack.push(`Testing: ${answers.testFramework}`);
  }

  if (answers.e2eFramework !== 'none') {
    stack.push(`E2E: ${answers.e2eFramework}`);
  }

  if (answers.deploymentPlatform !== 'none') {
    stack.push(`Deployment: ${answers.deploymentPlatform}`);
  }

  return stack;
}

function getAvailableCommands(components: SelectedComponents): string[] {
  return components.commands.map((cmd) => cmd.name);
}

function getCriticalRules(
  components: SelectedComponents
): Array<{ name: string; required: boolean }> {
  return components.rules
    .filter((rule) => rule.required)
    .map((rule) => ({ name: rule.name, required: rule.required }));
}
