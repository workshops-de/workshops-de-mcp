import axios from 'axios';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BASE_URL = 'https://workshops.de/api';

export async function GET(request) {
  return new Response('MCP endpoint - use POST for JSON-RPC requests', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Simple JSON-RPC handler for MCP
    if (body.method === 'initialize') {
      return Response.json({
        jsonrpc: '2.0',
        id: body.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: '@workshops.de/mcp',
            version: '1.1.0'
          }
        }
      });
    }
    
    if (body.method === 'tools/list') {
      return Response.json({
        jsonrpc: '2.0',
        id: body.id,
        result: {
          tools: [
            {
              name: 'list_courses',
              description: 'Zeigt alle verfügbaren Kurse von Workshops.DE an',
              inputSchema: {
                type: 'object',
                properties: {}
              }
            }
          ]
        }
      });
    }
    
    if (body.method === 'tools/call') {
      if (body.params?.name === 'list_courses') {
        const response = await axios.get(`${BASE_URL}/course/`);
        return Response.json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            content: [{
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }]
          }
        });
      }
    }
    
    // Method not found
    return Response.json({
      jsonrpc: '2.0',
      id: body.id,
      error: {
        code: -32601,
        message: 'Method not found'
      }
    });
    
  } catch (error) {
    return Response.json({
      jsonrpc: '2.0',
      id: 1,
      error: {
        code: -32603,
        message: error.message
      }
    });
  }
}