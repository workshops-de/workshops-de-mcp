import axios from 'axios';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BASE_URL = 'https://workshops.de/api';

// MCP Server Info
const SERVER_INFO = {
  name: '@workshops.de/mcp',
  version: '1.1.0',
  description: 'MCP Server für Workshops.DE API - Zugriff auf Kurse, Trainer und Events'
};

// Tool Definitions
const TOOLS = [
  {
    name: 'list_courses',
    description: 'Zeigt alle verfügbaren Kurse von Workshops.DE an',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_course_events',
    description: 'Zeigt alle Events/Termine für einen bestimmten Kurs an',
    inputSchema: {
      type: 'object',
      properties: {
        courseId: {
          type: 'string',
          description: 'Die ID des Kurses'
        }
      },
      required: ['courseId']
    }
  },
  {
    name: 'list_trainers',
    description: 'Zeigt alle Trainer von Workshops.DE an',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_course_trainers',
    description: 'Zeigt alle Trainer für einen bestimmten Kurs an',
    inputSchema: {
      type: 'object',
      properties: {
        courseId: {
          type: 'string',
          description: 'Die ID des Kurses'
        }
      },
      required: ['courseId']
    }
  },
  {
    name: 'list_events',
    description: 'Zeigt alle kommenden Schulungen und Events von Workshops.DE an',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_event',
    description: 'Zeigt Details zu einem bestimmten Event anhand der Event-ID',
    inputSchema: {
      type: 'object',
      properties: {
        eventId: {
          type: 'string',
          description: 'Die ID des Events'
        }
      },
      required: ['eventId']
    }
  }
];

// Tool Handlers
async function callTool(name, args) {
  try {
    switch (name) {
      case 'list_courses':
        const coursesResponse = await axios.get(`${BASE_URL}/course/`);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(coursesResponse.data, null, 2)
          }]
        };

      case 'get_course_events':
        const eventsResponse = await axios.get(`${BASE_URL}/course/${args.courseId}/events`);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(eventsResponse.data, null, 2)
          }]
        };

      case 'list_trainers':
        const trainersResponse = await axios.get(`${BASE_URL}/trainers/`);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(trainersResponse.data, null, 2)
          }]
        };

      case 'get_course_trainers':
        const courseTrainersResponse = await axios.get(`${BASE_URL}/course/${args.courseId}/trainers`);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(courseTrainersResponse.data, null, 2)
          }]
        };

      case 'list_events':
        const allEventsResponse = await axios.get(`${BASE_URL}/events`);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(allEventsResponse.data, null, 2)
          }]
        };

      case 'get_event':
        try {
          const eventResponse = await axios.get(`${BASE_URL}/events/${args.eventId}`);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(eventResponse.data, null, 2)
            }]
          };
        } catch (error) {
          if (error.response?.status === 404) {
            return {
              content: [{
                type: 'text',
                text: 'Einzelne Events können möglicherweise nicht über die API abgerufen werden.'
              }]
            };
          }
          throw error;
        }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error: ${error.message}`
      }],
      isError: true
    };
  }
}

// Main handlers
export async function GET(request) {
  return new Response('MCP endpoint - use POST for JSON-RPC requests', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}

export async function POST(request) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    const body = await request.json();
    
    // Handle JSON-RPC requests
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

    switch (body.method) {
      case 'initialize':
        return Response.json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {
                available: true,
                definitions: TOOLS
              },
              resources: {}
            },
            serverInfo: SERVER_INFO,
            instructions: "Ich bin der MCP Server für Workshops.DE und kann dir Informationen über Kurse, Trainer und Events liefern.",
            tools: TOOLS
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

        const result = await callTool(toolName, toolArgs);
        return Response.json({
          jsonrpc: '2.0',
          id: body.id,
          result
        }, { headers });

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