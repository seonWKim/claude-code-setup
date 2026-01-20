import { selectAgents } from './agents.js';
import { selectCommands } from './commands.js';
import { selectSkills } from './skills.js';
import { selectRules } from './rules.js';
import { selectHooks } from './hooks.js';
import { selectMCPServers } from './mcp.js';
import type { UserAnswers, SelectedComponents } from '../types/index.js';

export function mapAnswersToComponents(
  answers: UserAnswers
): SelectedComponents {
  return {
    agents: selectAgents(answers),
    commands: selectCommands(answers),
    skills: selectSkills(answers),
    rules: selectRules(answers),
    hooks: selectHooks(answers),
    mcpServers: selectMCPServers(answers),
  };
}

export {
  selectAgents,
  selectCommands,
  selectSkills,
  selectRules,
  selectHooks,
  selectMCPServers,
};
