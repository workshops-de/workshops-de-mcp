import { createMCPServer, handleJsonRpcRequest } from '../../../lib/mcp-server.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Create server instance
const server = createMCPServer();

// GET endpoint - simple info
export async function GET(request) {
  return new Response('MCP endpoint - POST JSON-RPC 2.0 requests to this URL', {
    status: 200,
    headers: { 
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*'
    }
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

    try {
      // Handle the MCP request using the SDK
      const result = await handleJsonRpcRequest(server, body);
      
      return Response.json({
        jsonrpc: '2.0',
        id: body.id,
        result
      }, { headers });
      
    } catch (error) {
      return Response.json({
        jsonrpc: '2.0',
        id: body.id,
        error: error.code ? error : {
          code: -32603,
          message: error.message
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