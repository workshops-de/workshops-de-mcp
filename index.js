#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const BASE_URL = 'https://workshops.de/api';

// Erstelle den MCP Server
const server = new Server(
  {
    name: '@workshops.de/mcp',
    version: '1.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool-Definitionen
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_courses',
        description: 'Zeigt alle verfügbaren Kurse von Workshops.DE an',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_course_events',
        description: 'Zeigt alle Events/Termine für einen bestimmten Kurs an',
        inputSchema: {
          type: 'object',
          properties: {
            courseId: {
              type: 'string',
              description: 'Die ID des Kurses',
            },
          },
          required: ['courseId'],
        },
      },
      {
        name: 'list_trainers',
        description: 'Zeigt alle Trainer von Workshops.DE an',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_course_trainers',
        description: 'Zeigt alle Trainer für einen bestimmten Kurs an',
        inputSchema: {
          type: 'object',
          properties: {
            courseId: {
              type: 'string',
              description: 'Die ID des Kurses',
            },
          },
          required: ['courseId'],
        },
      },
      {
        name: 'list_events',
        description: 'Zeigt alle kommenden Events/Schulungen von Workshops.DE an',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_event',
        description: 'Zeigt Details zu einem bestimmten Event anhand der Event-ID',
        inputSchema: {
          type: 'object',
          properties: {
            eventId: {
              type: 'string',
              description: 'Die ID des Events',
            },
          },
          required: ['eventId'],
        },
      },
    ],
  };
});

// Tool-Handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_courses': {
        const response = await axios.get(`${BASE_URL}/course/`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get_course_events': {
        const { courseId } = args;
        if (!courseId) {
          throw new Error('courseId ist erforderlich');
        }
        const response = await axios.get(`${BASE_URL}/course/${courseId}/events`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'list_trainers': {
        const response = await axios.get(`${BASE_URL}/trainers/`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get_course_trainers': {
        const { courseId } = args;
        if (!courseId) {
          throw new Error('courseId ist erforderlich');
        }
        const response = await axios.get(`${BASE_URL}/course/${courseId}/trainers`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'list_events': {
        const response = await axios.get(`${BASE_URL}/events`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get_event': {
        const { eventId } = args;
        if (!eventId) {
          throw new Error('eventId ist erforderlich');
        }
        // Hinweis: Dieser Endpunkt ist möglicherweise nicht in der öffentlichen API verfügbar
        const response = await axios.get(`${BASE_URL}/events/${eventId}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unbekanntes Tool: ${name}`);
    }
  } catch (error) {
    // Fehlerbehandlung
    let errorMessage = 'Ein Fehler ist aufgetreten';
    
    if (error.response) {
      // API hat mit einem Fehler geantwortet
      errorMessage = `API Fehler: ${error.response.status} - ${error.response.statusText}`;
      if (error.response.data) {
        errorMessage += `\nDetails: ${JSON.stringify(error.response.data)}`;
      }
    } else if (error.request) {
      // Keine Antwort erhalten
      errorMessage = 'Keine Antwort vom Server erhalten';
    } else {
      // Anderer Fehler
      errorMessage = error.message || errorMessage;
    }

    return {
      content: [
        {
          type: 'text',
          text: `Fehler: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Starte den Server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Workshops.DE MCP Server läuft...');
}

main().catch((error) => {
  console.error('Server Fehler:', error);
  process.exit(1);
}); 