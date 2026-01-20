"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSetupMd = generateSetupMd;
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
async function generateSetupMd(targetDir, answers, components) {
    spinner_js_1.default.start('Generating CLAUDE_SETUP.md...');
    const templatePath = path_1.default.join(getTemplatesDir(), 'CLAUDE_SETUP.md.ejs');
    const template = await fs_extra_1.default.readFile(templatePath, 'utf-8');
    const content = ejs_1.default.render(template, {
        answers,
        components,
        getEnvVarsNeeded,
        formatDate,
    });
    await fs_extra_1.default.writeFile(path_1.default.join(targetDir, 'CLAUDE_SETUP.md'), content.trim() + '\n');
    spinner_js_1.default.succeed('Generated CLAUDE_SETUP.md');
}
function getEnvVarsNeeded(components) {
    const envVars = [];
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
function formatDate() {
    return new Date().toISOString().split('T')[0];
}
//# sourceMappingURL=setup-md.js.map