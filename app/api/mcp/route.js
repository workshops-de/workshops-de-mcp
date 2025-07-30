import { TOOLS, callTool } from '../../../lib/mcp-tools.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SERVER_INFO = {
  name: '@workshops.de/mcp',
  version: '1.1.0'
};

const CAPABILITIES = {
  tools: {}
};

// GET endpoint - simple info
export async function GET(request) {
  return new Response('MCP endpoint - POST JSON-RPC 2.0 requests to this URL', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// POST endpoint - MCP JSON-RPC handler
export async function POST(request) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    const body = await request.json();
    
    // Basic JSON-RPC validation
    if (body.jsonrpc !== '2.0') {
      return Response.json({
        jsonrpc: '2.0',
        id: body.id || null,
        error: {
          code: -32600,
          message: 'Invalid Request'
        }
      }, { headers });
    }

    // Handle different methods
    switch (body.method) {
      case 'initialize':
        return Response.json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: CAPABILITIES,
            serverInfo: SERVER_INFO
          }
        }, { headers });

      case 'tools/list':
        return Response.json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            tools: TOOLS
          }
        }, { headers });

      case 'tools/call':
        const toolName = body.params?.name;
        const toolArgs = body.params?.arguments || {};
        
        if (!toolName) {
          return Response.json({
            jsonrpc: '2.0',
            id: body.id,
            error: {
              code: -32602,
              message: 'Invalid params: missing tool name'
            }
          }, { headers });
        }

        try {
          const result = await callTool(toolName, toolArgs);
          return Response.json({
            jsonrpc: '2.0',
            id: body.id,
            result
          }, { headers });
        } catch (error) {
          return Response.json({
            jsonrpc: '2.0',
            id: body.id,
            error: {
              code: -32603,
              message: error.message
            }
          }, { headers });
        }

      default:
        return Response.json({
          jsonrpc: '2.0',
          id: body.id,
          error: {
            code: -32601,
            message: `Method not found: ${body.method}`
          }
        }, { headers });
    }
    
  } catch (error) {
    return Response.json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32603,
        message: `Internal error: ${error.message}`
      }
    }, { headers });
  }
}

// OPTIONS endpoint for CORS
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}