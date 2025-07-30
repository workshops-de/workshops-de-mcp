# Streamable HTTP Endpoint Guide

This guide explains how to use the new Streamable HTTP endpoint for the Workshops.DE MCP Server.

## Endpoint

```
https://workshops-de-mcp.vercel.app/api/streamable
```

## Overview

This endpoint implements an MCP server that's compatible with Streamable HTTP clients, adapted for Next.js App Router. Since the official `StreamableHTTPServerTransport` is designed for Node.js HTTP servers (like Express), this implementation provides a Next.js-compatible alternative.

## Key Features

- ✅ Compatible with MCP Streamable HTTP clients
- ✅ Works with Next.js App Router
- ✅ Standard HTTP methods (GET, POST, OPTIONS)
- ✅ CORS enabled for browser access
- ✅ No session management (simple implementation)
- ✅ Proper JSON-RPC 2.0 handling

## How to Connect

### Using the MCP TypeScript SDK Client

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

// Create a client
const client = new Client({
  name: 'my-mcp-client',
  version: '1.0.0'
});

// Create transport
const transport = new StreamableHTTPClientTransport(
  new URL('https://workshops-de-mcp.vercel.app/api/streamable')
);

// Connect
await client.connect(transport);

// Now you can use the client
const tools = await client.listTools();
console.log('Available tools:', tools);

// Call a tool
const courses = await client.callTool({
  name: 'list_courses',
  arguments: {}
});
console.log('Courses:', courses);
```

### Direct HTTP Requests

The endpoint accepts standard MCP protocol messages. Here's an example using curl:

```bash
# Initialize connection
curl -X POST https://workshops-de-mcp.vercel.app/api/streamable \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "curl-client",
        "version": "1.0.0"
      }
    },
    "id": 1
  }'

# List available tools
curl -X POST https://workshops-de-mcp.vercel.app/api/streamable \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "params": {},
    "id": 2
  }'

# Call a tool
curl -X POST https://workshops-de-mcp.vercel.app/api/streamable \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "list_courses",
      "arguments": {}
    },
    "id": 3
  }'
```

## Available Tools

The endpoint provides access to all Workshops.DE API tools:

- `list_courses` - List all available courses
- `get_course_events` - Get events for a specific course (requires courseId)
- `list_trainers` - List all trainers
- `get_course_trainers` - Get trainers for a specific course (requires courseId)
- `list_events` - List all upcoming events
- `get_event` - Get details for a specific event (requires eventId)

## Implementation Details

This implementation:
- Provides a Next.js App Router compatible MCP endpoint
- Handles GET (server info), POST (MCP requests), and OPTIONS (CORS)
- Uses the same MCP server instance from `lib/mcp-server.js`
- Returns proper JSON-RPC 2.0 responses
- Includes streamable HTTP headers (Transfer-Encoding: chunked, Cache-Control: no-cache)

## Error Handling

The endpoint returns proper HTTP status codes and JSON-RPC error responses:
- `200` - Success
- `400` - Invalid JSON-RPC request
- `405` - Method not allowed
- `500` - Server error (with JSON-RPC error format)

## Comparison with Standard Endpoint

| Feature | `/api/mcp` (Standard) | `/api/streamable` (New) |
|---------|----------------------|------------------------|
| Protocol | JSON-RPC 2.0 | JSON-RPC 2.0 with Streamable HTTP headers |
| Implementation | Custom handler | Next.js-adapted streamable handler |
| Session Management | No | No |
| Client Compatibility | Standard MCP clients | Streamable HTTP MCP clients |
| Next.js Compatible | Yes | Yes |

## Testing

You can test the endpoint using any HTTP client or the official MCP SDK. The endpoint is live at:
https://workshops-de-mcp.vercel.app/api/streamable