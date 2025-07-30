import { TOOLS, callTool } from './mcp-tools.js';

// MCP Server Info
export const SERVER_INFO = {
  name: '@workshops.de/mcp',
  version: '1.1.0',
  description: 'MCP Server für Workshops.DE API - Zugriff auf Kurse, Trainer und Events'
};

// Handle MCP JSON-RPC requests
export async function handleMcpRequest(request) {
  switch (request.method) {
    case 'initialize':
      return {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          resources: {}
        },
        serverInfo: SERVER_INFO
      };

    case 'tools/list':
      return {
        tools: TOOLS
      };

    case 'tools/call':
      const toolName = request.params?.name;
      const toolArgs = request.params?.arguments || {};
      
      if (!toolName) {
        throw {
          code: -32602,
          message: 'Invalid params: missing tool name'
        };
      }

      return await callTool(toolName, toolArgs);

    default:
      throw {
        code: -32601,
        message: `Method not found: ${request.method}`
      };
  }
}

// Create JSON-RPC response
export function createJsonRpcResponse(id, result, error = null) {
  if (error) {
    return {
      jsonrpc: '2.0',
      id,
      error
    };
  }
  
  return {
    jsonrpc: '2.0',
    id,
    result
  };
}

// Default headers for HTTP responses
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Request-Id'
};