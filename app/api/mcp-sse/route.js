import { handleMcpRequest, createJsonRpcResponse, SERVER_INFO } from '../../../lib/mcp-handler.js';

export const runtime = 'edge'; // Edge Runtime für besseres Streaming
export const dynamic = 'force-dynamic';

// Store für bidirektionale Kommunikation
const messageQueues = new Map();

// GET endpoint - SSE stream
export async function GET(request) {
  const encoder = new TextEncoder();
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id') || crypto.randomUUID();
  
  // Create message queue for this session
  messageQueues.set(sessionId, []);
  
  let intervalId;
  
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      const event = {
        type: 'connection',
        sessionId,
        serverInfo: SERVER_INFO,
        instructions: 'Send requests to POST /api/mcp-sse/message with sessionId'
      };
      
      controller.enqueue(encoder.encode(`event: open\ndata: ${JSON.stringify(event)}\n\n`));
      
      // Process message queue
      intervalId = setInterval(() => {
        const queue = messageQueues.get(sessionId);
        if (queue && queue.length > 0) {
          const message = queue.shift();
          controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(message)}\n\n`));
        }
        
        // Send ping to keep connection alive
        controller.enqueue(encoder.encode(`:ping\n\n`));
      }, 1000);
    },
    
    cancel() {
      if (intervalId) {
        clearInterval(intervalId);
      }
      messageQueues.delete(sessionId);
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff',
    }
  });
}

// POST endpoint - receive messages for SSE
export async function POST(request) {
  try {
    const { sessionId, message } = await request.json();
    
    if (!sessionId || !message) {
      return Response.json({
        error: 'sessionId and message are required'
      }, { status: 400 });
    }
    
    // Validate JSON-RPC
    if (message.jsonrpc !== '2.0') {
      const response = createJsonRpcResponse(message.id || null, null, {
        code: -32600,
        message: 'Invalid Request'
      });
      
      const queue = messageQueues.get(sessionId);
      if (queue) {
        queue.push(response);
      }
      
      return Response.json({ status: 'queued', response });
    }
    
    try {
      // Handle the MCP request
      const result = await handleMcpRequest(message);
      const response = createJsonRpcResponse(message.id, result);
      
      // Add to queue for SSE
      const queue = messageQueues.get(sessionId);
      if (queue) {
        queue.push(response);
      }
      
      return Response.json({ status: 'queued', response });
      
    } catch (error) {
      const response = createJsonRpcResponse(
        message.id,
        null,
        error.code ? error : { code: -32603, message: error.message }
      );
      
      const queue = messageQueues.get(sessionId);
      if (queue) {
        queue.push(response);
      }
      
      return Response.json({ status: 'queued', response });
    }
    
  } catch (error) {
    return Response.json({
      error: `Invalid request: ${error.message}`
    }, { status: 400 });
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