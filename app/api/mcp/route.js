import { handleMcpRequest, createJsonRpcResponse, DEFAULT_HEADERS } from '../../../lib/mcp-handler.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// GET endpoint - simple info
export async function GET(request) {
  return new Response('MCP endpoint (Streamable HTTP) - use POST for JSON-RPC requests', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// POST endpoint - Streamable HTTP transport for MCP
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate JSON-RPC request
    if (body.jsonrpc !== '2.0') {
      return Response.json(
        createJsonRpcResponse(body.id || null, null, {
          code: -32600,
          message: 'Invalid Request'
        }),
        { headers: DEFAULT_HEADERS }
      );
    }

    try {
      // Handle the MCP request
      const result = await handleMcpRequest(body);
      return Response.json(
        createJsonRpcResponse(body.id, result),
        { headers: DEFAULT_HEADERS }
      );
    } catch (error) {
      // Handle MCP-specific errors
      if (error.code) {
        return Response.json(
          createJsonRpcResponse(body.id, null, error),
          { headers: DEFAULT_HEADERS }
        );
      }
      
      // Handle unexpected errors
      throw error;
    }
    
  } catch (error) {
    return Response.json(
      createJsonRpcResponse(null, null, {
        code: -32603,
        message: `Internal error: ${error.message}`
      }),
      { headers: DEFAULT_HEADERS }
    );
  }
}

// OPTIONS endpoint for CORS
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: DEFAULT_HEADERS
  });
}