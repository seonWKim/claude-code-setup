import chalk from 'chalk';

export const logger = {
  info: (message: string) => {
    console.log(chalk.blue('ℹ'), message);
  },

  success: (message: string) => {
    console.log(chalk.green('✓'), message);
  },

  warning: (message: string) => {
    console.log(chalk.yellow('⚠'), message);
  },

  error: (message: string) => {
    console.log(chalk.red('✗'), message);
  },

  title: (message: string) => {
    console.log('\n' + chalk.bold.cyan(message));
  },

  subtitle: (message: string) => {
    console.log(chalk.dim(message));
  },

  list: (items: string[], indent = 2) => {
    const padding = ' '.repeat(indent);
    items.forEach((item) => {
      console.log(`${padding}${chalk.dim('•')} ${item}`);
    });
  },

  box: (lines: string[]) => {
    const maxLength = Math.max(...lines.map((l) => l.length));
    const horizontalBorder = '─'.repeat(maxLength + 2);

    console.log(chalk.cyan(`╭${horizontalBorder}╮`));
    lines.forEach((line) => {
      const padding = ' '.repeat(maxLength - line.length);
      console.log(chalk.cyan('│') + ` ${line}${padding} ` + chalk.cyan('│'));
    });
    console.log(chalk.cyan(`╰${horizontalBorder}╯`));
  },

  newline: () => {
    console.log();
  },

  divider: () => {
    console.log(chalk.dim('─'.repeat(50)));
  },
};

export default logger;
