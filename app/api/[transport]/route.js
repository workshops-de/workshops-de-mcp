import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';
import axios from 'axios';

const BASE_URL = 'https://workshops.de/api';

// Tool handlers
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

// Create MCP handler
const handler = createMcpHandler(
  (server) => {
    // Register all tools
    server.tool(
      'list_courses',
      'Zeigt alle verfügbaren Kurse von Workshops.DE an',
      {},
      async () => callTool('list_courses', {})
    );

    server.tool(
      'get_course_events',
      'Zeigt alle Events/Termine für einen bestimmten Kurs an',
      {
        courseId: z.string().describe('Die ID des Kurses')
      },
      async (args) => callTool('get_course_events', args)
    );

    server.tool(
      'list_trainers',
      'Zeigt alle Trainer von Workshops.DE an',
      {},
      async () => callTool('list_trainers', {})
    );

    server.tool(
      'get_course_trainers',
      'Zeigt alle Trainer für einen bestimmten Kurs an',
      {
        courseId: z.string().describe('Die ID des Kurses')
      },
      async (args) => callTool('get_course_trainers', args)
    );

    server.tool(
      'list_events',
      'Zeigt alle kommenden Schulungen und Events von Workshops.DE an',
      {},
      async () => callTool('list_events', {})
    );

    server.tool(
      'get_event',
      'Zeigt Details zu einem bestimmten Event anhand der Event-ID',
      {
        eventId: z.string().describe('Die ID des Events')
      },
      async (args) => callTool('get_event', args)
    );
  },
  {
    name: '@workshops.de/mcp',
    version: '1.1.0',
    description: 'MCP Server für Workshops.DE API - Zugriff auf Kurse, Trainer und Events'
  },
  {
    basePath: '/api'
  }
);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export { handler as GET, handler as POST, handler as DELETE };