"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.logger = {
    info: (message) => {
        console.log(chalk_1.default.blue('ℹ'), message);
    },
    success: (message) => {
        console.log(chalk_1.default.green('✓'), message);
    },
    warning: (message) => {
        console.log(chalk_1.default.yellow('⚠'), message);
    },
    error: (message) => {
        console.log(chalk_1.default.red('✗'), message);
    },
    title: (message) => {
        console.log('\n' + chalk_1.default.bold.cyan(message));
    },
    subtitle: (message) => {
        console.log(chalk_1.default.dim(message));
    },
    list: (items, indent = 2) => {
        const padding = ' '.repeat(indent);
        items.forEach((item) => {
            console.log(`${padding}${chalk_1.default.dim('•')} ${item}`);
        });
    },
    box: (lines) => {
        const maxLength = Math.max(...lines.map((l) => l.length));
        const horizontalBorder = '─'.repeat(maxLength + 2);
        console.log(chalk_1.default.cyan(`╭${horizontalBorder}╮`));
        lines.forEach((line) => {
            const padding = ' '.repeat(maxLength - line.length);
            console.log(chalk_1.default.cyan('│') + ` ${line}${padding} ` + chalk_1.default.cyan('│'));
        });
        console.log(chalk_1.default.cyan(`╰${horizontalBorder}╯`));
    },
    newline: () => {
        console.log();
    },
    divider: () => {
        console.log(chalk_1.default.dim('─'.repeat(50)));
    },
};
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map