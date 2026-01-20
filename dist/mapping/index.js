"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectMCPServers = exports.selectHooks = exports.selectRules = exports.selectSkills = exports.selectCommands = exports.selectAgents = void 0;
exports.mapAnswersToComponents = mapAnswersToComponents;
const agents_js_1 = require("./agents.js");
Object.defineProperty(exports, "selectAgents", { enumerable: true, get: function () { return agents_js_1.selectAgents; } });
const commands_js_1 = require("./commands.js");
Object.defineProperty(exports, "selectCommands", { enumerable: true, get: function () { return commands_js_1.selectCommands; } });
const skills_js_1 = require("./skills.js");
Object.defineProperty(exports, "selectSkills", { enumerable: true, get: function () { return skills_js_1.selectSkills; } });
const rules_js_1 = require("./rules.js");
Object.defineProperty(exports, "selectRules", { enumerable: true, get: function () { return rules_js_1.selectRules; } });
const hooks_js_1 = require("./hooks.js");
Object.defineProperty(exports, "selectHooks", { enumerable: true, get: function () { return hooks_js_1.selectHooks; } });
const mcp_js_1 = require("./mcp.js");
Object.defineProperty(exports, "selectMCPServers", { enumerable: true, get: function () { return mcp_js_1.selectMCPServers; } });
function mapAnswersToComponents(answers) {
    return {
        agents: (0, agents_js_1.selectAgents)(answers),
        commands: (0, commands_js_1.selectCommands)(answers),
        skills: (0, skills_js_1.selectSkills)(answers),
        rules: (0, rules_js_1.selectRules)(answers),
        hooks: (0, hooks_js_1.selectHooks)(answers),
        mcpServers: (0, mcp_js_1.selectMCPServers)(answers),
    };
}
//# sourceMappingURL=index.js.map