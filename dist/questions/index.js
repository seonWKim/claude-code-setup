"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askWorkflowQuestions = exports.askDevOpsQuestions = exports.askSecurityQuestions = exports.askTestingQuestions = exports.askBackendQuestions = exports.askFrontendQuestions = exports.askProjectQuestions = void 0;
exports.askAllQuestions = askAllQuestions;
const project_js_1 = require("./project.js");
Object.defineProperty(exports, "askProjectQuestions", { enumerable: true, get: function () { return project_js_1.askProjectQuestions; } });
const frontend_js_1 = require("./frontend.js");
Object.defineProperty(exports, "askFrontendQuestions", { enumerable: true, get: function () { return frontend_js_1.askFrontendQuestions; } });
const backend_js_1 = require("./backend.js");
Object.defineProperty(exports, "askBackendQuestions", { enumerable: true, get: function () { return backend_js_1.askBackendQuestions; } });
const testing_js_1 = require("./testing.js");
Object.defineProperty(exports, "askTestingQuestions", { enumerable: true, get: function () { return testing_js_1.askTestingQuestions; } });
const security_js_1 = require("./security.js");
Object.defineProperty(exports, "askSecurityQuestions", { enumerable: true, get: function () { return security_js_1.askSecurityQuestions; } });
const devops_js_1 = require("./devops.js");
Object.defineProperty(exports, "askDevOpsQuestions", { enumerable: true, get: function () { return devops_js_1.askDevOpsQuestions; } });
const workflow_js_1 = require("./workflow.js");
Object.defineProperty(exports, "askWorkflowQuestions", { enumerable: true, get: function () { return workflow_js_1.askWorkflowQuestions; } });
const logger_js_1 = __importDefault(require("../utils/logger.js"));
async function askAllQuestions() {
    logger_js_1.default.newline();
    logger_js_1.default.title('Project Configuration');
    logger_js_1.default.newline();
    // 1. Project questions
    const projectAnswers = await (0, project_js_1.askProjectQuestions)();
    logger_js_1.default.newline();
    logger_js_1.default.title('Frontend Stack');
    logger_js_1.default.newline();
    // 2. Frontend questions
    const frontendAnswers = await (0, frontend_js_1.askFrontendQuestions)(projectAnswers.projectType);
    logger_js_1.default.newline();
    logger_js_1.default.title('Backend Stack');
    logger_js_1.default.newline();
    // 3. Backend questions
    const backendAnswers = await (0, backend_js_1.askBackendQuestions)(projectAnswers.projectType);
    logger_js_1.default.newline();
    logger_js_1.default.title('Testing Strategy');
    logger_js_1.default.newline();
    // 4. Testing questions
    const testingAnswers = await (0, testing_js_1.askTestingQuestions)(backendAnswers.backendLanguage, projectAnswers.projectGoal, frontendAnswers.hasFrontend);
    logger_js_1.default.newline();
    logger_js_1.default.title('Security');
    logger_js_1.default.newline();
    // 5. Security questions
    const securityAnswers = await (0, security_js_1.askSecurityQuestions)(projectAnswers.projectGoal, backendAnswers.databaseClient);
    logger_js_1.default.newline();
    logger_js_1.default.title('DevOps & Integrations');
    logger_js_1.default.newline();
    // 6. DevOps questions
    const devopsAnswers = await (0, devops_js_1.askDevOpsQuestions)(backendAnswers.databaseClient);
    logger_js_1.default.newline();
    logger_js_1.default.title('Workflow');
    logger_js_1.default.newline();
    // 7. Workflow questions
    const workflowAnswers = await (0, workflow_js_1.askWorkflowQuestions)(projectAnswers.projectGoal);
    return {
        ...projectAnswers,
        ...frontendAnswers,
        ...backendAnswers,
        ...testingAnswers,
        ...securityAnswers,
        ...devopsAnswers,
        ...workflowAnswers,
    };
}
//# sourceMappingURL=index.js.map