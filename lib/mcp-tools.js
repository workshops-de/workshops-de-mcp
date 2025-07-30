import axios from 'axios';

const BASE_URL = 'https://workshops.de/api';

// Tool Definitions
export const TOOLS = [
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
export async function callTool(name, args) {
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