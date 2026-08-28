// ═══════════════════════════════════════════════════════════════════════════════
// SULTAN AI OS — Tool Definitions for Agents
// ═══════════════════════════════════════════════════════════════════════════════

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  handler?: string; // Reference to handler function
  requiredPermissions?: string[];
  agentCategories?: string[];
}

export const SULTAN_TOOLS: ToolDefinition[] = [
  // ── Core Tools ──
  {
    name: 'chat',
    description: 'Send a chat message to an AI model for natural language processing',
    parameters: {
      type: 'object',
      properties: { message: { type: 'string', description: 'The message to send' }, model: { type: 'string', description: 'Optional model override' } },
      required: ['message'],
    },
  },
  {
    name: 'search',
    description: 'Search across Sultan platform data (listings, services, businesses, news, etc.)',
    parameters: {
      type: 'object',
      properties: { query: { type: 'string' }, type: { type: 'string', enum: ['all', 'listings', 'services', 'businesses', 'news', 'users'] }, city: { type: 'string' }, limit: { type: 'number', default: 20 } },
      required: ['query'],
    },
  },
  {
    name: 'delegate',
    description: 'Delegate a task to a specialized agent',
    parameters: {
      type: 'object',
      properties: { agentId: { type: 'string', description: 'Target agent ID' }, task: { type: 'string' }, context: { type: 'object' } },
      required: ['agentId', 'task'],
    },
    agentCategories: ['core'],
  },

  // ── Knowledge & Memory ──
  {
    name: 'knowledge_query',
    description: 'Search the organizational knowledge base',
    parameters: { type: 'object', properties: { query: { type: 'string' }, type: { type: 'string' }, limit: { type: 'number' } }, required: ['query'] },
  },
  {
    name: 'knowledge_store',
    description: 'Store new knowledge in the organizational knowledge base',
    parameters: { type: 'object', properties: { type: { type: 'string' }, title: { type: 'string' }, content: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, source: { type: 'string' } }, required: ['type', 'title', 'content'] },
  },
  {
    name: 'memory_store',
    description: 'Store information in agent memory',
    parameters: { type: 'object', properties: { type: { type: 'string', enum: ['short_term', 'session', 'long_term', 'organizational'] }, category: { type: 'string' }, title: { type: 'string' }, content: { type: 'string' }, importance: { type: 'number' } }, required: ['type', 'category', 'title', 'content'] },
  },
  {
    name: 'memory_retrieve',
    description: 'Retrieve information from agent memory',
    parameters: { type: 'object', properties: { query: { type: 'string' }, type: { type: 'string' }, limit: { type: 'number' } }, required: ['query'] },
  },

  // ── Task Management ──
  {
    name: 'task_create',
    description: 'Create a new task for an agent',
    parameters: { type: 'object', properties: { agentId: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] }, input: { type: 'object' } }, required: ['agentId', 'title'] },
  },
  {
    name: 'task_update',
    description: 'Update task status or progress',
    parameters: { type: 'object', properties: { taskId: { type: 'string' }, status: { type: 'string' }, progress: { type: 'number' }, output: { type: 'object' }, error: { type: 'string' } }, required: ['taskId'] },
  },
  {
    name: 'workflow_start',
    description: 'Start a workflow with multiple steps',
    parameters: { type: 'object', properties: { workflowType: { type: 'string' }, input: { type: 'object' } }, required: ['workflowType'] },
  },

  // ── GitHub Tools ──
  {
    name: 'github_read',
    description: 'Read files or data from a GitHub repository',
    parameters: { type: 'object', properties: { repo: { type: 'string' }, path: { type: 'string' }, branch: { type: 'string', default: 'main' } }, required: ['repo', 'path'] },
    requiredPermissions: ['github'],
  },
  {
    name: 'github_write',
    description: 'Write or modify files in a GitHub repository (requires approval)',
    parameters: { type: 'object', properties: { repo: { type: 'string' }, path: { type: 'string' }, content: { type: 'string' }, message: { type: 'string' }, branch: { type: 'string' } }, required: ['repo', 'path', 'content', 'message'] },
    requiredPermissions: ['github'],
  },
  {
    name: 'github_pr',
    description: 'Create or review a pull request',
    parameters: { type: 'object', properties: { repo: { type: 'string' }, title: { type: 'string' }, body: { type: 'string' }, head: { type: 'string' }, base: { type: 'string' } }, required: ['repo', 'title'] },
    requiredPermissions: ['github'],
  },

  // ── Supabase Tools ──
  {
    name: 'supabase_inspect',
    description: 'Inspect Supabase database schema, tables, or RLS policies',
    parameters: { type: 'object', properties: { action: { type: 'string', enum: ['list_tables', 'describe_table', 'check_rls', 'query_stats', 'list_functions'] }, table: { type: 'string' } }, required: ['action'] },
    requiredPermissions: ['database'],
  },

  // ── Cloudflare Tools ──
  {
    name: 'cloudflare_deploy',
    description: 'Trigger or manage Cloudflare deployment',
    parameters: { type: 'object', properties: { action: { type: 'string', enum: ['deploy', 'rollback', 'status'] }, target: { type: 'string' } }, required: ['action'] },
    requiredPermissions: ['cloudflare'],
  },
  {
    name: 'cloudflare_logs',
    description: 'Fetch Cloudflare deployment or worker logs',
    parameters: { type: 'object', properties: { limit: { type: 'number' }, filter: { type: 'string' } }, required: [] },
    requiredPermissions: ['cloudflare'],
  },
  {
    name: 'cloudflare_status',
    description: 'Get Cloudflare Pages deployment status and health',
    parameters: { type: 'object', properties: {}, required: [] },
    requiredPermissions: ['cloudflare'],
  },

  // ── Analysis Tools ──
  {
    name: 'code_analyze',
    description: 'Analyze code for issues, patterns, or improvements',
    parameters: { type: 'object', properties: { code: { type: 'string' }, language: { type: 'string' }, focus: { type: 'string', enum: ['bugs', 'performance', 'security', 'style', 'all'] } }, required: ['code'] },
  },
  {
    name: 'code_generate',
    description: 'Generate code based on specifications',
    parameters: { type: 'object', properties: { specification: { type: 'string' }, language: { type: 'string' }, context: { type: 'string' } }, required: ['specification', 'language'] },
  },
  {
    name: 'data_analyze',
    description: 'Analyze data and generate insights',
    parameters: { type: 'object', properties: { data: { type: 'string' }, analysisType: { type: 'string' }, dimensions: { type: 'array', items: { type: 'string' } } }, required: ['data', 'analysisType'] },
  },
  {
    name: 'database_query',
    description: 'Execute a read-only database query for analysis',
    parameters: { type: 'object', properties: { sql: { type: 'string' }, description: { type: 'string' } }, required: ['sql', 'description'] },
    requiredPermissions: ['database'],
  },

  // ── Web & Browser Tools ──
  {
    name: 'web_search',
    description: 'Search the web for information',
    parameters: { type: 'object', properties: { query: { type: 'string' }, numResults: { type: 'number', default: 5 } }, required: ['query'] },
  },
  {
    name: 'web_read',
    description: 'Read and extract content from a web page',
    parameters: { type: 'object', properties: { url: { type: 'string' }, extractType: { type: 'string', enum: ['text', 'links', 'images', 'structured'] } }, required: ['url'] },
  },
  {
    name: 'browser_navigate',
    description: 'Navigate a browser to a URL',
    parameters: { type: 'object', properties: { url: { type: 'string' }, waitMs: { type: 'number' } }, required: ['url'] },
  },
  {
    name: 'browser_read',
    description: 'Read the current page content in a browser session',
    parameters: { type: 'object', properties: { selector: { type: 'string' }, extractType: { type: 'string' } }, required: [] },
  },

  // ── Report & Content Tools ──
  {
    name: 'report_generate',
    description: 'Generate a formatted report',
    parameters: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' }, format: { type: 'string', enum: ['markdown', 'json', 'summary'] } }, required: ['title', 'content'] },
  },
  {
    name: 'trend_detect',
    description: 'Detect trends in platform data',
    parameters: { type: 'object', properties: { dataType: { type: 'string' }, period: { type: 'string' }, limit: { type: 'number' } }, required: ['dataType'] },
  },
  {
    name: 'social_post',
    description: 'Create or schedule a social media post (requires approval)',
    parameters: { type: 'object', properties: { platform: { type: 'string' }, content: { type: 'string' }, scheduledAt: { type: 'string' } }, required: ['platform', 'content'] },
    requiredPermissions: ['social'],
  },
  {
    name: 'social_analyze',
    description: 'Analyze social media engagement and trends',
    parameters: { type: 'object', properties: { platform: { type: 'string' }, metric: { type: 'string' }, period: { type: 'string' } }, required: ['platform'] },
  },
  {
    name: 'test_run',
    description: 'Run tests and report results',
    parameters: { type: 'object', properties: { testType: { type: 'string' }, target: { type: 'string' } }, required: ['testType'] },
  },
  {
    name: 'security_scan',
    description: 'Perform a security scan on code or configuration',
    parameters: { type: 'object', properties: { target: { type: 'string' }, scanType: { type: 'string', enum: ['dependencies', 'code', 'config', 'full'] } }, required: ['target'] },
  },
  {
    name: 'rls_audit',
    description: 'Audit Row Level Security policies',
    parameters: { type: 'object', properties: { table: { type: 'string' }, checkMode: { type: 'string', enum: ['policy_review', 'test_access', 'gap_analysis'] } }, required: [] },
  },
  {
    name: 'build_analyze',
    description: 'Analyze build output for errors and warnings',
    parameters: { type: 'object', properties: { buildOutput: { type: 'string' } }, required: [] },
  },
  {
    name: 'log_analyze',
    description: 'Analyze application logs for errors and patterns',
    parameters: { type: 'object', properties: { logs: { type: 'string' }, filter: { type: 'string' } }, required: ['logs'] },
  },
  {
    name: 'content_create',
    description: 'Create content for the platform',
    parameters: { type: 'object', properties: { type: { type: 'string' }, title: { type: 'string' }, body: { type: 'string' }, language: { type: 'string' } }, required: ['type', 'title', 'body'] },
  },
  {
    name: 'content_review',
    description: 'Review content for quality, accuracy, and policy compliance',
    parameters: { type: 'object', properties: { content: { type: 'string' }, reviewType: { type: 'string' } }, required: ['content'] },
  },
];

export function getToolsForAgent(agentId: string): ToolDefinition[] {
  const agent = require('../core/agent-registry').getAgentDefinition(agentId);
  if (!agent) return SULTAN_TOOLS.slice(0, 5);
  return SULTAN_TOOLS.filter(tool => {
    if (!tool.agentCategories) return true;
    if (tool.agentCategories.includes('core') && agent.id === 'agent-master') return true;
    return true;
  });
}

export function getToolDefinition(name: string): ToolDefinition | undefined {
  return SULTAN_TOOLS.find(t => t.name === name);
}
