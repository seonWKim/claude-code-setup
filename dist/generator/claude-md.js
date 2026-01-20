"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateClaudeMd = generateClaudeMd;
const ejs_1 = __importDefault(require("ejs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const spinner_js_1 = __importDefault(require("../utils/spinner.js"));
// Get the templates directory relative to the package root
function getTemplatesDir() {
    // When running from dist/, we need to go up to the package root
    // __dirname in CommonJS will be dist/generator/
    const distDir = __dirname;
    const packageRoot = path_1.default.resolve(distDir, '../..');
    return path_1.default.join(packageRoot, 'templates');
}
async function generateClaudeMd(targetDir, answers, components) {
    spinner_js_1.default.start('Generating CLAUDE.md...');
    const templatePath = path_1.default.join(getTemplatesDir(), 'CLAUDE.md.ejs');
    const template = await fs_extra_1.default.readFile(templatePath, 'utf-8');
    const content = ejs_1.default.render(template, {
        answers,
        components,
        getTechStackSummary,
        getAvailableCommands,
        getCriticalRules,
    });
    await fs_extra_1.default.writeFile(path_1.default.join(targetDir, 'CLAUDE.md'), content.trim() + '\n');
    spinner_js_1.default.succeed('Generated CLAUDE.md');
}
function getTechStackSummary(answers) {
    const stack = [];
    if (answers.hasFrontend) {
        let frontend = answers.frontendFramework;
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
function getAvailableCommands(components) {
    return components.commands.map((cmd) => cmd.name);
}
function getCriticalRules(components) {
    return components.rules
        .filter((rule) => rule.required)
        .map((rule) => ({ name: rule.name, required: rule.required }));
}
//# sourceMappingURL=claude-md.js.map