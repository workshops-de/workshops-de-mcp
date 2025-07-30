# MCP Transport Implementierungen

Dieses Projekt bietet zwei verschiedene Transport-Mechanismen für das Model Context Protocol (MCP):

## 1. Streamable HTTP Transport

**Endpoint:** `/api/mcp`

### Eigenschaften:
- Standard JSON-RPC 2.0 über HTTP POST
- Einfache Request/Response Kommunikation
- Kompatibel mit MCP Inspector und den meisten Clients
- Unterstützt von Claude Web (claude.ai) als Remote MCP Server

### Verwendung:

```bash
# Test mit curl
curl -X POST https://workshops-de-mcp.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'

# Mit MCP Inspector
npx @modelcontextprotocol/inspector@latest https://workshops-de-mcp.vercel.app/api/mcp
```

### Claude Integration:
- Gehe zu Settings > Connectors in Claude
- Füge Remote Server hinzu: `https://workshops-de-mcp.vercel.app/api/mcp`

## 2. Server-Sent Events (SSE) Transport

**Endpoint:** `/api/mcp-sse`

### Eigenschaften:
- Unidirektionale Event-Streams vom Server zum Client
- Bidirektionale Kommunikation über separate POST Requests
- Bessere Unterstützung für Echtzeit-Updates
- Experimentell für Claude

### Verwendung:

```javascript
// 1. SSE Verbindung öffnen
const eventSource = new EventSource('https://workshops-de-mcp.vercel.app/api/mcp-sse');
let sessionId;

eventSource.addEventListener('open', (event) => {
  const data = JSON.parse(event.data);
  sessionId = data.sessionId;
  console.log('Connected:', data);
});

eventSource.addEventListener('message', (event) => {
  const response = JSON.parse(event.data);
  console.log('Response:', response);
});

// 2. Requests senden
async function sendRequest(method, params = {}) {
  const response = await fetch('https://workshops-de-mcp.vercel.app/api/mcp-sse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      message: {
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params
      }
    })
  });
  return response.json();
}

// Beispiel
await sendRequest('initialize');
await sendRequest('tools/list');
await sendRequest('tools/call', { 
  name: 'list_courses', 
  arguments: {} 
});
```

## Gemeinsame Komponenten

### Tool Definitionen (`lib/mcp-tools.js`)
- `list_courses` - Alle Kurse anzeigen
- `get_course_events` - Events für einen Kurs
- `list_trainers` - Alle Trainer
- `get_course_trainers` - Trainer für einen Kurs
- `list_events` - Alle Events
- `get_event` - Event-Details

### MCP Handler (`lib/mcp-handler.js`)
- Gemeinsame Request-Verarbeitung
- JSON-RPC Response-Erstellung
- Error Handling

## Empfehlung

Für die meisten Anwendungsfälle empfehlen wir den **Streamable HTTP Transport** (`/api/mcp`):
- Einfacher zu implementieren
- Breite Client-Unterstützung
- Stabil und zuverlässig
- Offiziell von Claude unterstützt

Der SSE Transport ist für spezielle Anwendungsfälle gedacht, bei denen:
- Server-initiierte Updates benötigt werden
- Lange Verbindungen aufrechterhalten werden müssen
- Echtzeit-Kommunikation erforderlich ist