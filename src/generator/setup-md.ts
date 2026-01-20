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

export async function generateSetupMd(
  targetDir: string,
  answers: UserAnswers,
  components: SelectedComponents
): Promise<void> {
  spinner.start('Generating CLAUDE_SETUP.md...');

  const templatePath = path.join(getTemplatesDir(), 'CLAUDE_SETUP.md.ejs');
  const template = await fs.readFile(templatePath, 'utf-8');

  const content = ejs.render(template, {
    answers,
    components,
    getEnvVarsNeeded,
    formatDate,
  });

  await fs.writeFile(
    path.join(targetDir, 'CLAUDE_SETUP.md'),
    content.trim() + '\n'
  );

  spinner.succeed('Generated CLAUDE_SETUP.md');
}

function getEnvVarsNeeded(components: SelectedComponents): string[] {
  const envVars: string[] = [];

  for (const server of components.mcpServers) {
    if (server.config.env) {
      for (const [key, value] of Object.entries(server.config.env)) {
        if (value.includes('YOUR_')) {
          envVars.push(`${key} - ${server.config.description}`);
        }
      }
    }
  }

  return envVars;
}

function formatDate(): string {
  return new Date().toISOString().split('T')[0];
}
