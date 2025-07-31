# Server-Sent Events (SSE) MCP Endpoint Guide

This guide explains how to use the Server-Sent Events endpoint for real-time communication with the Workshops.DE MCP Server.

## Endpoint

```
https://workshops-de-mcp.vercel.app/api/mcp
```

## Overview

The SSE endpoint provides real-time bidirectional communication with the MCP server using Server-Sent Events for server-to-client messages and HTTP POST for client-to-server messages. This implementation includes session management and connection monitoring.

## Key Features

- ✅ Real-time server-to-client communication via SSE
- ✅ Session-based connection management
- ✅ Automatic keep-alive with ping/pong
- ✅ Full MCP protocol support
- ✅ CORS enabled for browser access
- ✅ Connection state monitoring

## How to Connect

### Step 1: Establish SSE Connection

First, establish the SSE connection to get a session ID:

```javascript
// Connect to SSE endpoint
const eventSource = new EventSource('https://workshops-de-mcp.vercel.app/api/mcp');

let sessionId = null;

eventSource.addEventListener('connection', (event) => {
  const data = JSON.parse(event.data);
  sessionId = data.sessionId;
  console.log('Connected with session ID:', sessionId);
});

eventSource.addEventListener('response', (event) => {
  const response = JSON.parse(event.data);
  console.log('Received response:', response);
});

eventSource.addEventListener('error', (event) => {
  const error = JSON.parse(event.data);
  console.error('Received error:', error);
});

eventSource.addEventListener('ping', (event) => {
  const data = JSON.parse(event.data);
  console.log('Keep-alive ping:', data.timestamp);
});
```

### Step 2: Send MCP Messages

Once you have a session ID, send MCP messages via POST:

```javascript
async function sendMCPMessage(message) {
  if (!sessionId) {
    throw new Error('No active session. Connect first.');
  }
  
  const response = await fetch(`https://workshops-de-mcp.vercel.app/api/mcp?sessionId=${sessionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message)
  });
  
  const result = await response.json();
  return result;
}

// Example: Initialize MCP connection
await sendMCPMessage({
  jsonrpc: '2.0',
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'sse-client',
      version: '1.0.0'
    }
  },
  id: 1
});

// Example: List tools
await sendMCPMessage({
  jsonrpc: '2.0',
  method: 'tools/list',
  params: {},
  id: 2
});

// Example: Call a tool
await sendMCPMessage({
  jsonrpc: '2.0',
  method: 'tools/call',
  params: {
    name: 'list_courses',
    arguments: {}
  },
  id: 3
});
```

### Complete Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>MCP SSE Client</title>
</head>
<body>
    <h1>MCP SSE Client</h1>
    <div id="status">Disconnected</div>
    <div id="messages"></div>
    <button onclick="testConnection()">Test MCP Connection</button>

    <script>
        let sessionId = null;
        let eventSource = null;
        let messageId = 1;

        function connect() {
            eventSource = new EventSource('/api/mcp');
            
            eventSource.addEventListener('connection', (event) => {
                const data = JSON.parse(event.data);
                sessionId = data.sessionId;
                document.getElementById('status').innerText = `Connected (Session: ${sessionId})`;
                console.log('Connected:', data);
            });

            eventSource.addEventListener('response', (event) => {
                const response = JSON.parse(event.data);
                addMessage('Response', response);
            });

            eventSource.addEventListener('error', (event) => {
                const error = JSON.parse(event.data);
                addMessage('Error', error);
            });

            eventSource.addEventListener('ping', (event) => {
                const data = JSON.parse(event.data);
                console.log('Ping received:', data.timestamp);
            });

            eventSource.onerror = (error) => {
                console.error('SSE connection error:', error);
                document.getElementById('status').innerText = 'Connection Error';
            };
        }

        async function sendMessage(message) {
            if (!sessionId) {
                alert('Not connected. Please refresh and try again.');
                return;
            }

            try {
                const response = await fetch(`/api/mcp?sessionId=${sessionId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(message)
                });
                
                const result = await response.json();
                addMessage('Sent', message);
                console.log('Message sent:', result);
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }

        async function testConnection() {
            // Initialize
            await sendMessage({
                jsonrpc: '2.0',
                method: 'initialize',
                params: {
                    protocolVersion: '2024-11-05',
                    capabilities: {},
                    clientInfo: { name: 'web-client', version: '1.0.0' }
                },
                id: messageId++
            });

            // List tools
            setTimeout(async () => {
                await sendMessage({
                    jsonrpc: '2.0',
                    method: 'tools/list',
                    params: {},
                    id: messageId++
                });
            }, 1000);

            // Call a tool
            setTimeout(async () => {
                await sendMessage({
                    jsonrpc: '2.0',
                    method: 'tools/call',
                    params: {
                        name: 'list_courses',
                        arguments: {}
                    },
                    id: messageId++
                });
            }, 2000);
        }

        function addMessage(type, data) {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${type}:</strong> <pre>${JSON.stringify(data, null, 2)}</pre>`;
            div.style.margin = '10px 0';
            div.style.padding = '10px';
            div.style.backgroundColor = type === 'Error' ? '#ffebee' : '#f5f5f5';
            div.style.border = '1px solid #ddd';
            div.style.borderRadius = '4px';
            document.getElementById('messages').appendChild(div);
        }

        // Auto-connect when page loads
        connect();
    </script>
</body>
</html>
```

## SSE Events

The endpoint sends several types of events:

### `connection`
Sent when the SSE connection is established:
```json
{
  "type": "connection",
  "sessionId": "uuid-here",
  "serverInfo": {
    "name": "@workshops.de/mcp",
    "version": "1.1.0",
    "transport": "sse"
  }
}
```

### `response`
Sent when a successful MCP response is ready:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": { ... }
}
```

### `error`
Sent when an MCP error occurs:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32603,
    "message": "Internal error"
  }
}
```

### `ping`
Sent every 30 seconds as keep-alive:
```json
{
  "type": "ping",
  "timestamp": 1703123456789
}
```

## Available Tools

The endpoint provides access to all Workshops.DE API tools:

- `list_courses` - List all available courses
- `get_course_events` - Get events for a specific course (requires courseId)
- `list_trainers` - List all trainers
- `get_course_trainers` - Get trainers for a specific course (requires courseId)
- `list_events` - List all upcoming events
- `get_event` - Get details for a specific event (requires eventId)

## Error Handling

The endpoint returns proper HTTP status codes:
- `200` - Success (for both SSE connection and message processing)
- `400` - Bad request (missing sessionId)
- `404` - Session not found or expired
- `500` - Server error

## Session Management

- Sessions are automatically created when establishing SSE connection
- Sessions are cleaned up when the client disconnects
- Keep-alive pings are sent every 30 seconds
- No explicit session expiration (sessions live until disconnection)

## Testing the Endpoint

You can test the SSE endpoint using:

1. **Browser Developer Tools**: Open Network tab and connect to the SSE endpoint
2. **curl for SSE connection**:
   ```bash
   curl -N -H "Accept: text/event-stream" http://localhost:3000/api/mcp
   ```
3. **curl for sending messages** (replace SESSION_ID):
   ```bash
   curl -X POST "http://localhost:3000/api/mcp?sessionId=SESSION_ID" \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}'
   ```

## Comparison with Other Endpoints

| Feature | `/api/mcp` (SSE) | `/api/streamable` | Standard JSON-RPC |
|---------|------------------|-------------------|-------------------|
| Transport | Server-Sent Events | HTTP Streaming | Simple HTTP |
| Real-time | Yes | Limited | No |
| Session Management | Yes | No | No |
| Browser Support | Excellent | Good | Excellent |
| Complexity | Medium | Low | Low |

The SSE endpoint is ideal for applications that need real-time updates and persistent connections with the MCP server.