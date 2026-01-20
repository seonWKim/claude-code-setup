"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askFrontendQuestions = askFrontendQuestions;
const inquirer_1 = __importDefault(require("inquirer"));
const wizard_js_1 = require("../utils/wizard.js");
function getMetaFrameworkChoices(framework) {
    const choices = [
        { name: 'None', value: 'none' },
    ];
    if (framework === 'react') {
        choices.unshift({ name: 'Next.js', value: 'nextjs' }, { name: 'Remix', value: 'remix' }, { name: 'Astro', value: 'astro' });
    }
    else if (framework === 'vue') {
        choices.unshift({ name: 'Nuxt', value: 'nuxt' }, { name: 'Astro', value: 'astro' });
    }
    else if (framework === 'svelte') {
        choices.unshift({ name: 'SvelteKit', value: 'sveltekit' }, { name: 'Astro', value: 'astro' });
    }
    return choices;
}
async function askFrontendQuestions(projectType, isFirstSection = false) {
    // Skip frontend questions for backend-only projects
    if (projectType === 'backend') {
        return {
            hasFrontend: false,
            frontendFramework: 'none',
            metaFramework: 'none',
            stylingApproach: 'vanilla-css',
        };
    }
    const questions = [
        { key: 'hasFrontend', default: { hasFrontend: false, frontendFramework: 'none', metaFramework: 'none', stylingApproach: 'vanilla-css' } },
        { key: 'frontendFramework' },
        { key: 'metaFramework' },
        { key: 'stylingApproach' },
    ];
    let currentIndex = 0;
    const answers = {};
    while (currentIndex < questions.length) {
        const isFirst = isFirstSection && currentIndex === 0;
        const questionKey = questions[currentIndex].key;
        try {
            switch (questionKey) {
                case 'hasFrontend': {
                    const hasFrontendChoices = [
                        { name: 'Yes', value: true },
                        { name: 'No', value: false },
                        ...(!isFirst ? [new inquirer_1.default.Separator(), wizard_js_1.GO_BACK_CHOICE] : []),
                    ];
                    const hasFrontend = await (0, wizard_js_1.askWithGoBack)({
                        type: 'list',
                        name: 'hasFrontend',
                        message: 'Does your project have a frontend?',
                        choices: hasFrontendChoices,
                    }, true); // Pass true to skip adding go back again
                    if (!hasFrontend) {
                        return {
                            hasFrontend: false,
                            frontendFramework: 'none',
                            metaFramework: 'none',
                            stylingApproach: 'vanilla-css',
                        };
                    }
                    answers.hasFrontend = true;
                    break;
                }
                case 'frontendFramework': {
                    answers.frontendFramework = await (0, wizard_js_1.askWithGoBack)({
                        type: 'list',
                        name: 'frontendFramework',
                        message: 'Which frontend framework are you using?',
                        choices: [
                            { name: 'React', value: 'react' },
                            { name: 'Vue', value: 'vue' },
                            { name: 'Svelte', value: 'svelte' },
                            { name: 'Angular', value: 'angular' },
                            { name: 'Vanilla JavaScript/TypeScript', value: 'vanilla' },
                        ],
                    }, false);
                    break;
                }
                case 'metaFramework': {
                    answers.metaFramework = await (0, wizard_js_1.askWithGoBack)({
                        type: 'list',
                        name: 'metaFramework',
                        message: 'Are you using a meta-framework?',
                        choices: getMetaFrameworkChoices(answers.frontendFramework),
                    }, false);
                    break;
                }
                case 'stylingApproach': {
                    answers.stylingApproach = await (0, wizard_js_1.askWithGoBack)({
                        type: 'list',
                        name: 'stylingApproach',
                        message: 'What styling approach are you using?',
                        choices: [
                            { name: 'Tailwind CSS', value: 'tailwind' },
                            { name: 'CSS Modules', value: 'css-modules' },
                            { name: 'styled-components / Emotion', value: 'styled-components' },
                            { name: 'SCSS/Sass', value: 'scss' },
                            { name: 'Vanilla CSS', value: 'vanilla-css' },
                        ],
                    }, false);
                    break;
                }
            }
            currentIndex++;
        }
        catch (error) {
            if (error instanceof wizard_js_1.GoBackError) {
                if (currentIndex > 0) {
                    currentIndex--;
                }
                else {
                    throw error; // Propagate to go back to previous section
                }
            }
            else {
                throw error;
            }
        }
    }
    return answers;
}
//# sourceMappingURL=frontend.js.map