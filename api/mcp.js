import axios from 'axios';

const BASE_URL = 'https://workshops.de/api';

// MCP Tool implementations
const tools = {
  list_courses: async () => {
    const response = await axios.get(`${BASE_URL}/course/`);
    return response.data;
  },
  
  get_course_events: async ({ courseId }) => {
    if (!courseId) throw new Error('courseId ist erforderlich');
    const response = await axios.get(`${BASE_URL}/course/${courseId}/events`);
    return response.data;
  },
  
  list_trainers: async () => {
    const response = await axios.get(`${BASE_URL}/trainers/`);
    return response.data;
  },
  
  get_course_trainers: async ({ courseId }) => {
    if (!courseId) throw new Error('courseId ist erforderlich');
    const response = await axios.get(`${BASE_URL}/course/${courseId}/trainers`);
    return response.data;
  },
  
  list_events: async () => {
    const response = await axios.get(`${BASE_URL}/events`);
    return response.data;
  },
  
  get_event: async ({ eventId }) => {
    if (!eventId) throw new Error('eventId ist erforderlich');
    try {
      const response = await axios.get(`${BASE_URL}/events/${eventId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Event-Details sind möglicherweise nicht über die API verfügbar');
      }
      throw error;
    }
  }
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    // Return available tools
    return res.status(200).json({
      name: '@workshops.de/mcp',
      version: '1.1.0',
      description: 'MCP Server für Workshops.DE API',
      tools: Object.keys(tools).map(name => ({
        name,
        description: getToolDescription(name)
      }))
    });
  }
  
  if (req.method === 'POST') {
    const { tool, params = {} } = req.body;
    
    if (!tool || !tools[tool]) {
      return res.status(400).json({ 
        error: 'Invalid tool',
        available: Object.keys(tools) 
      });
    }
    
    try {
      const result = await tools[tool](params);
      return res.status(200).json({
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }]
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
        isError: true
      });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

function getToolDescription(toolName) {
  const descriptions = {
    list_courses: 'Zeigt alle verfügbaren Kurse von Workshops.DE an',
    get_course_events: 'Zeigt alle Events/Termine für einen bestimmten Kurs an',
    list_trainers: 'Zeigt alle Trainer von Workshops.DE an',
    get_course_trainers: 'Zeigt alle Trainer für einen bestimmten Kurs an',
    list_events: 'Zeigt alle kommenden Events/Schulungen von Workshops.DE an',
    get_event: 'Zeigt Details zu einem bestimmten Event anhand der Event-ID'
  };
  return descriptions[toolName] || '';
} 