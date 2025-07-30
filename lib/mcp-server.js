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

// Handle JSON-RPC requests directly
export async function handleJsonRpcRequest(server, request) {
  try {
    switch (request.method) {
      case 'initialize':
        return {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: '@workshops.de/mcp',
            version: '1.1.0'
          }
        };
        
      case 'tools/list':
        const listHandler = server._requestHandlers.get('tools/list');
        if (listHandler) {
          return await listHandler(request);
        }
        throw new Error('No handler for tools/list');
        
      case 'tools/call':
        const callHandler = server._requestHandlers.get('tools/call');
        if (callHandler) {
          return await callHandler(request);
        }
        throw new Error('No handler for tools/call');
        
      default:
        throw {
          code: -32601,
          message: `Method not found: ${request.method}`
        };
    }
  } catch (error) {
    if (error.code) {
      throw error;
    }
    throw {
      code: -32603,
      message: error.message
    };
  }
}