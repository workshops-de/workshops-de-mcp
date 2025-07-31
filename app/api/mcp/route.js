import { createMCPServer, handleJsonRpcRequest } from '../../../lib/mcp-server.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Store active SSE connections
const sessions = new Map();

// Lazy server initialization
let server = null;

function getServer() {
  if (!server) {
    server = createMCPServer();
  }
  return server;
}

// Handle GET requests - establish SSE connection
export async function GET(request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId');

  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // If no sessionId provided, establish new SSE connection
  if (!sessionId) {
    try {
      // Generate a session ID for this connection
      const newSessionId = crypto.randomUUID();
      
      // Create a readable stream for SSE
      const stream = new ReadableStream({
        start(controller) {
          // Store the controller for this session
          sessions.set(newSessionId, {
            controller,
            connected: true,
            createdAt: Date.now()
          });
          
          // Send initial connection event with session ID
          controller.enqueue(`event: connection\n`);
          controller.enqueue(`data: ${JSON.stringify({ 
            type: 'connection', 
            sessionId: newSessionId,
            serverInfo: {
              name: '@workshops.de/mcp',
              version: '1.1.0',
              transport: 'sse'
            }
          })}\n\n`);
          
          // Send periodic keep-alive
          const keepAlive = setInterval(() => {
            if (sessions.has(newSessionId)) {
              try {
                controller.enqueue(`event: ping\n`);
                controller.enqueue(`data: ${JSON.stringify({ type: 'ping', timestamp: Date.now() })}\n\n`);
              } catch (error) {
                clearInterval(keepAlive);
                sessions.delete(newSessionId);
              }
            } else {
              clearInterval(keepAlive);
            }
          }, 30000); // Every 30 seconds
        },
        cancel() {
          // Clean up when client disconnects
          sessions.delete(newSessionId);
        }
      });

      return new Response(stream, { headers });
      
    } catch (error) {
      console.error('SSE connection error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to establish SSE connection' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          } 
        }
      );
    }
  }

  // Handle requests with sessionId - return session info
  const session = sessions.get(sessionId);
  return new Response(
    JSON.stringify({ 
      message: 'SSE endpoint',
      sessionId,
      connected: session ? session.connected : false,
      sessionsCount: sessions.size
    }),
    { 
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      } 
    }
  );
}

// Handle POST requests - process MCP messages
export async function POST(request) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'sessionId parameter required' }),
        { status: 400, headers }
      );
    }

    const session = sessions.get(sessionId);
    if (!session || !session.connected) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { status: 404, headers }
      );
    }

    const message = await request.json();
    
    // Validate JSON-RPC request
    if (!message.jsonrpc || message.jsonrpc !== '2.0') {
      const errorResponse = {
        jsonrpc: '2.0',
        id: message.id || null,
        error: {
          code: -32600,
          message: 'Invalid Request: Invalid JSON-RPC version'
        }
      };
      
      // Send error via SSE
      session.controller.enqueue(`event: response\n`);
      session.controller.enqueue(`data: ${JSON.stringify(errorResponse)}\n\n`);
      
      return new Response(
        JSON.stringify({ status: 'error sent via SSE' }),
        { headers }
      );
    }

    try {
      // Handle the request using the MCP server
      const result = await handleJsonRpcRequest(getServer(), message);
      
      const response = {
        jsonrpc: '2.0',
        id: message.id,
        result
      };
      
      // Send response via SSE
      session.controller.enqueue(`event: response\n`);
      session.controller.enqueue(`data: ${JSON.stringify(response)}\n\n`);
      
      return new Response(
        JSON.stringify({ status: 'response sent via SSE' }),
        { headers }
      );
      
    } catch (error) {
      const errorResponse = {
        jsonrpc: '2.0',
        id: message.id || null,
        error: {
          code: error.code || -32603,
          message: error.message || 'Internal error',
          data: error.stack
        }
      };
      
      // Send error via SSE
      session.controller.enqueue(`event: error\n`);
      session.controller.enqueue(`data: ${JSON.stringify(errorResponse)}\n\n`);
      
      return new Response(
        JSON.stringify({ status: 'error sent via SSE' }),
        { headers }
      );
    }

  } catch (error) {
    console.error('SSE message processing error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process message',
        details: error.message 
      }),
      { status: 500, headers }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}