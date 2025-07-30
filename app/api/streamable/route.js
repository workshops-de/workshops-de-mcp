import { createMCPServer } from '../../../lib/mcp-server.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Create a single server instance
const server = createMCPServer();

// Store transports by sessionId
const transports = new Map();

export async function GET(req) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('sessionId');
  
  if (!sessionId) {
    // Create new session
    const transport = new StreamableHTTPServerTransport({
      endpoint: '/api/streamable'
    });
    
    const sessionUrl = new URL(url);
    sessionUrl.searchParams.set('sessionId', transport.sessionId);
    
    transports.set(transport.sessionId, transport);
    await server.connect(transport);
    
    // Clean up on disconnect
    transport.once('close', () => {
      transports.delete(transport.sessionId);
    });
    
    // Return redirect to session URL
    return new Response(null, {
      status: 301,
      headers: {
        'Location': sessionUrl.toString(),
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  // Handle GET request for existing session
  const transport = transports.get(sessionId);
  if (!transport) {
    return new Response('Session not found', { status: 404 });
  }
  
  return transport.handleGet();
}

export async function POST(req) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('sessionId');
  
  if (!sessionId) {
    return new Response('Session ID required', { status: 400 });
  }
  
  const transport = transports.get(sessionId);
  if (!transport) {
    return new Response('Session not found', { status: 404 });
  }
  
  const body = await req.text();
  return transport.handlePost(body);
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('sessionId');
  
  if (!sessionId) {
    return new Response('Session ID required', { status: 400 });
  }
  
  const transport = transports.get(sessionId);
  if (!transport) {
    return new Response('Session not found', { status: 404 });
  }
  
  transport.close();
  transports.delete(sessionId);
  
  return new Response('Session closed', { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function OPTIONS(req) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}