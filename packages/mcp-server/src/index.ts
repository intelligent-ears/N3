#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { securityPrompts } from './prompts/index.js';
import { analyzeContract, getContractTransactions, checkVulnerabilities } from './tools/index.js';

const server = new Server(
  {
    name: 'n3-security-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      prompts: {},
      tools: {},
    },
  }
);

// List available prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'comprehensive-security-audit',
        description: 'Comprehensive security audit of a smart contract',
        arguments: [
          {
            name: 'contract_address',
            description: 'The contract address to audit',
            required: true,
          },
          {
            name: 'chain',
            description: 'Blockchain network (ethereum, polygon, etc.)',
            required: false,
          },
        ],
      },
      {
        name: 'real-time-monitoring',
        description: 'Real-time threat detection and monitoring',
        arguments: [
          {
            name: 'contract_address',
            description: 'The contract address to monitor',
            required: true,
          },
        ],
      },
      {
        name: 'vulnerability-deep-dive',
        description: 'Deep dive analysis of specific vulnerability type',
        arguments: [
          {
            name: 'contract_address',
            description: 'The contract address to analyze',
            required: true,
          },
          {
            name: 'vulnerability_type',
            description: 'Type of vulnerability (reentrancy, access-control, etc.)',
            required: true,
          },
        ],
      },
      {
        name: 'comparative-security',
        description: 'Compare security posture of two contracts',
        arguments: [
          {
            name: 'contract_a',
            description: 'First contract address',
            required: true,
          },
          {
            name: 'contract_b',
            description: 'Second contract address',
            required: true,
          },
        ],
      },
      {
        name: 'exploit-detection',
        description: 'Detect potential exploit patterns in transactions',
        arguments: [
          {
            name: 'contract_address',
            description: 'The contract address to check',
            required: true,
          },
          {
            name: 'tx_count',
            description: 'Number of recent transactions to analyze',
            required: false,
          },
        ],
      },
    ],
  };
});

// Get specific prompt
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  const prompt = securityPrompts[name];
  if (!prompt) {
    throw new Error(`Prompt not found: ${name}`);
  }
  
  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: prompt(args || {}),
        },
      },
    ],
  };
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze_contract',
        description: 'Analyze a smart contract for vulnerabilities using N3 templates',
        inputSchema: {
          type: 'object',
          properties: {
            address: {
              type: 'string',
              description: 'Contract address',
            },
            chain: {
              type: 'string',
              description: 'Blockchain network',
              default: 'ethereum',
            },
          },
          required: ['address'],
        },
      },
      {
        name: 'get_transactions',
        description: 'Get recent transactions for a contract',
        inputSchema: {
          type: 'object',
          properties: {
            address: {
              type: 'string',
              description: 'Contract address',
            },
            limit: {
              type: 'number',
              description: 'Number of transactions to fetch',
              default: 100,
            },
          },
          required: ['address'],
        },
      },
      {
        name: 'check_vulnerability',
        description: 'Check for specific vulnerability type',
        inputSchema: {
          type: 'object',
          properties: {
            address: {
              type: 'string',
              description: 'Contract address',
            },
            type: {
              type: 'string',
              description: 'Vulnerability type',
              enum: ['reentrancy', 'access-control', 'oracle', 'flash-loan', 'overflow'],
            },
          },
          required: ['address', 'type'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'analyze_contract':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(await analyzeContract((args as any)?.address || '', (args as any)?.chain), null, 2),
          },
        ],
      };
      
    case 'get_transactions':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(await getContractTransactions((args as any)?.address || '', (args as any)?.limit), null, 2),
          },
        ],
      };
      
    case 'check_vulnerability':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(await checkVulnerabilities((args as any)?.address || '', (args as any)?.type || ''), null, 2),
          },
        ],
      };
      
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('N3 Security MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
