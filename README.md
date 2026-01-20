# claude-code-setup

A CLI tool that configures Claude Code for any project by asking questions about your tech stack and generating the appropriate configuration files.

## Installation

```bash
npm install -g claude-code-setup
# or
npx claude-code-setup
```

## Usage

Run the CLI in your project directory:

```bash
claude-code-setup
# or
ccs
```

The CLI will:

1. Ask you about your project (type, goal, tech stack, security needs, etc.)
2. Download configurations from [everything-claude-code](https://github.com/affaan-m/everything-claude-code)
3. Copy relevant agents, commands, skills, rules, and hooks
4. Generate a customized `CLAUDE.md` with project-specific instructions
5. Generate `CLAUDE_SETUP.md` explaining what was configured and why

## Generated Files

```
your-project/
├── .claude/
│   ├── agents/           # AI agent configurations
│   ├── commands/         # Custom slash commands
│   ├── skills/           # Skill configurations
│   ├── rules/            # Rule definitions
│   └── settings.local.json  # Hook configurations
├── .claude.json          # MCP server configurations
├── CLAUDE.md             # Project-specific AI instructions
└── CLAUDE_SETUP.md       # Setup documentation
```

## Question Categories

The CLI asks questions in 7 categories:

1. **Project Info** - Name, type (fullstack/frontend/backend/etc.), goal
2. **Frontend Stack** - Framework, meta-framework, styling approach
3. **Backend Stack** - Language, framework, database, ORM
4. **Testing** - Approach (TDD/standard/minimal), framework, E2E, coverage
5. **Security** - Level, authentication provider, payments, blockchain
6. **DevOps** - Deployment platform, CI/CD, MCP integrations
7. **Workflow** - Team size, git workflow, code review, hooks

## Selection Logic

Components are selected based on your answers:

| Answer | → | Selected Tools |
|--------|---|----------------|
| `projectGoal: production/enterprise` | → | planner, architect, doc-updater agents |
| `testingApproach: tdd` | → | tdd-guide agent, /tdd command |
| `securityLevel: high` | → | security-reviewer agent, security rule |
| `teamSize: !solo` | → | code-reviewer agent, git-workflow rule |
| `e2eFramework: playwright` | → | e2e-runner agent, /e2e command |
| `deploymentPlatform: vercel` | → | Vercel MCP server |

## Options

```bash
claude-code-setup --directory <path>  # Specify target directory
claude-code-setup --version           # Show version
claude-code-setup --help              # Show help
```

## Development

```bash
# Clone the repository
git clone https://github.com/affaan-m/everything-claude-code
cd everything-claude-code/claude-code-setup

# Install dependencies
npm install

# Build
npm run build

# Run locally
node dist/index.js
```

## License

MIT
