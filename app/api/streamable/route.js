import { createMCPServer, handleJsonRpcRequest } from '../../../lib/mcp-server.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Create server instance
const server = createMCPServer();

// Streamable HTTP endpoint handler
export async function handler(request) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    // Streamable HTTP specific headers
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache',
  };

  // Handle OPTIONS for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  // Handle GET - return server info
  if (request.method === 'GET') {
    return new Response(
      JSON.stringify({
        name: '@workshops.de/mcp',
        version: '1.1.0',
        description: 'MCP Server for Workshops.DE API (Streamable HTTP)',
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        }
      }),
      { 
        status: 200, 
        headers 
      }
    );
  }

  // Handle POST - process MCP requests
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      
      // Validate JSON-RPC request
      if (body.jsonrpc !== '2.0') {
        return new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            id: body.id || null,
            error: {
              code: -32600,
              message: 'Invalid Request: Invalid JSON-RPC version'
            }
          }),
          { status: 400, headers }
        );
      }

      // Handle the request using the MCP server
      const result = await handleJsonRpcRequest(server, body);
      
      // Return successful response
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id: body.id,
          result
        }),
        { status: 200, headers }
      );
      
    } catch (error) {
      console.error('Request error:', error);
      
      // Return error response
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: {
            code: error.code || -32603,
            message: error.message || 'Internal error',
            data: error.stack
          }
        }),
        { 
          status: 500, 
          headers 
        }
      );
    }
  }

  // Method not allowed
  return new Response(
    JSON.stringify({
      error: 'Method not allowed',
      allowed: ['GET', 'POST', 'OPTIONS']
    }),
    { 
      status: 405, 
      headers: {
        ...headers,
        'Allow': 'GET, POST, OPTIONS'
      }
    }
  );
}

// Export named functions for each HTTP method
export async function GET(request) {
  return handler(request);
}

export async function POST(request) {
  return handler(request);
}

export async function PUT(request) {
  return handler(request);
}

export async function DELETE(request) {
  return handler(request);
}

export async function OPTIONS(request) {
  return handler(request);
}