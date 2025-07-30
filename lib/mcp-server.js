import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TOOLS, callTool } from './mcp-tools.js';

// Create MCP server instance
export function createMCPServer() {
  const server = new Server(
    {
      name: '@workshops.de/mcp',
      version: '1.1.0',
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  // Handle tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const toolArgs = request.params.arguments || {};
    
    try {
      const result = await callTool(toolName, toolArgs);
      return result;
    } catch (error) {
      if (error.isError) {
        return error;
      }
      throw error;
    }
  });

  return server;
}