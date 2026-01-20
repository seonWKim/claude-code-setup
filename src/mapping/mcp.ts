import type { UserAnswers, MCPServerSelection, MCPServerConfig } from '../types/index.js';

const MCP_CONFIGS: Record<string, MCPServerConfig> = {
  github: {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN: 'YOUR_GITHUB_PAT_HERE',
    },
    description: 'GitHub operations - PRs, issues, repos',
  },
  firecrawl: {
    command: 'npx',
    args: ['-y', 'firecrawl-mcp'],
    env: {
      FIRECRAWL_API_KEY: 'YOUR_FIRECRAWL_KEY_HERE',
    },
    description: 'Web scraping and crawling',
  },
  supabase: {
    command: 'npx',
    args: [
      '-y',
      '@supabase/mcp-server-supabase@latest',
      '--project-ref=YOUR_PROJECT_REF',
    ],
    description: 'Supabase database operations',
  },
  memory: {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-memory'],
    description: 'Persistent memory across sessions',
  },
  'sequential-thinking': {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
    description: 'Chain-of-thought reasoning',
  },
  vercel: {
    type: 'http',
    url: 'https://mcp.vercel.com',
    description: 'Vercel deployments and projects',
  },
  railway: {
    command: 'npx',
    args: ['-y', '@railway/mcp-server'],
    description: 'Railway deployments',
  },
  'cloudflare-docs': {
    type: 'http',
    url: 'https://docs.mcp.cloudflare.com/mcp',
    description: 'Cloudflare documentation search',
  },
  'cloudflare-workers-builds': {
    type: 'http',
    url: 'https://builds.mcp.cloudflare.com/mcp',
    description: 'Cloudflare Workers builds',
  },
  'cloudflare-workers-bindings': {
    type: 'http',
    url: 'https://bindings.mcp.cloudflare.com/mcp',
    description: 'Cloudflare Workers bindings',
  },
  'cloudflare-observability': {
    type: 'http',
    url: 'https://observability.mcp.cloudflare.com/mcp',
    description: 'Cloudflare observability/logs',
  },
  clickhouse: {
    type: 'http',
    url: 'https://mcp.clickhouse.cloud/mcp',
    description: 'ClickHouse analytics queries',
  },
  context7: {
    command: 'npx',
    args: ['-y', '@context7/mcp-server'],
    description: 'Live documentation lookup',
  },
  magic: {
    command: 'npx',
    args: ['-y', '@magicuidesign/mcp@latest'],
    description: 'Magic UI components',
  },
  filesystem: {
    command: 'npx',
    args: [
      '-y',
      '@modelcontextprotocol/server-filesystem',
      '/path/to/your/projects',
    ],
    description: 'Filesystem operations (set your path)',
  },
};

export function selectMCPServers(answers: UserAnswers): MCPServerSelection[] {
  const servers: MCPServerSelection[] = [];

  for (const integration of answers.mcpIntegrations) {
    const config = MCP_CONFIGS[integration];
    if (config) {
      servers.push({
        name: integration,
        config,
        reason: getReasonForMCP(integration, answers),
      });
    }
  }

  return servers;
}

function getReasonForMCP(
  integration: string,
  answers: UserAnswers
): string {
  switch (integration) {
    case 'github':
      return 'Git workflow and PR management';
    case 'context7':
      return 'Live documentation for your tech stack';
    case 'sequential-thinking':
      return 'Enhanced reasoning for complex problems';
    case 'memory':
      return 'Persistent context across sessions';
    case 'firecrawl':
      return 'Web scraping capabilities';
    case 'magic':
      return 'UI component generation';
    case 'supabase':
      return 'Database client is Supabase';
    case 'vercel':
      return 'Deployment platform is Vercel';
    case 'railway':
      return 'Deployment platform is Railway';
    case 'cloudflare-docs':
    case 'cloudflare-workers-builds':
      return 'Deployment platform is Cloudflare';
    case 'clickhouse':
      return 'Analytics with ClickHouse';
    default:
      return 'User selected';
  }
}

export function getMCPConfig(
  serverName: string
): MCPServerConfig | undefined {
  return MCP_CONFIGS[serverName];
}
