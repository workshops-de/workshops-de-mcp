import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';
import axios from 'axios';

export const runtime = 'nodejs'; // Use Node.js runtime for axios support
export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const maxDuration = 60; // Maximum allowed duration for Vercel Hobby: 60 seconds

const BASE_URL = 'https://workshops.de/api';

const handler = createMcpHandler(
  (server) => {
    server.tool(
      'list_courses',
      'Zeigt alle verfügbaren Kurse von Workshops.DE an',
      {},
      async () => {
        const response = await axios.get(`${BASE_URL}/course/`);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }],
        };
      },
    );
    
    server.tool(
      'get_course_events',
      'Zeigt alle Events/Termine für einen bestimmten Kurs an',
      { courseId: z.string().describe('Die ID des Kurses') },
      async ({ courseId }) => {
        const response = await axios.get(`${BASE_URL}/course/${courseId}/events`);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }],
        };
      },
    );
    
    server.tool(
      'list_trainers',
      'Zeigt alle Trainer von Workshops.DE an',
      {},
      async () => {
        const response = await axios.get(`${BASE_URL}/trainers/`);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }],
        };
      },
    );
    
    server.tool(
      'get_course_trainers',
      'Zeigt alle Trainer für einen bestimmten Kurs an',
      { courseId: z.string().describe('Die ID des Kurses') },
      async ({ courseId }) => {
        const response = await axios.get(`${BASE_URL}/course/${courseId}/trainers`);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }],
        };
      },
    );
    
    server.tool(
      'list_events',
      'Zeigt alle kommenden Events/Schulungen von Workshops.DE an',
      {},
      async () => {
        const response = await axios.get(`${BASE_URL}/events`);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }],
        };
      },
    );
    
    server.tool(
      'get_event',
      'Zeigt Details zu einem bestimmten Event anhand der Event-ID',
      { eventId: z.string().describe('Die ID des Events') },
      async ({ eventId }) => {
        try {
          const response = await axios.get(`${BASE_URL}/events/${eventId}`);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(response.data, null, 2)
            }],
          };
        } catch (error) {
          if (error.response?.status === 404) {
            return {
              content: [{
                type: 'text',
                text: 'Einzelne Events können möglicherweise nicht über die API abgerufen werden.'
              }],
            };
          }
          throw error;
        }
      },
    );
  },
  {
    name: '@workshops.de/mcp',
    version: '1.1.0',
    description: 'MCP Server für Workshops.DE API - Zugriff auf Kurse, Trainer und Events'
  }
);

export const GET = handler;
export const POST = handler;
export const OPTIONS = handler; 