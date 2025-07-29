export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Workshops.DE MCP Server</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: #fafafa;
        }
        h1, h2 { color: #333; }
        code, pre {
          background: #f4f4f4;
          padding: 0.5rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }
        pre {
          overflow-x: auto;
          padding: 1rem;
        }
        .endpoint {
          background: #e8f5e9;
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          border: 1px solid #4caf50;
        }
        ul { line-height: 1.8; }
        .tool { 
          margin: 0.5rem 0;
          padding: 0.5rem;
          background: white;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <h1>🚀 Workshops.DE MCP Server</h1>
      <p>Dies ist ein Model Context Protocol (MCP) Server für die Workshops.DE API.</p>
      
      <div class="endpoint">
        <h2>🔌 MCP Endpoint</h2>
        <code style="font-size: 1.1em;">${req.headers.host}/api/mcp</code>
      </div>
      
      <h2>📋 Verfügbare Tools</h2>
      <div style="background: white; padding: 1rem; border-radius: 8px;">
        <div class="tool"><strong>list_courses</strong> - Zeigt alle verfügbaren Kurse</div>
        <div class="tool"><strong>get_course_events</strong> - Events für einen Kurs (Parameter: courseId)</div>
        <div class="tool"><strong>list_trainers</strong> - Alle Trainer anzeigen</div>
        <div class="tool"><strong>get_course_trainers</strong> - Trainer für einen Kurs (Parameter: courseId)</div>
        <div class="tool"><strong>list_events</strong> - Alle kommenden Events</div>
        <div class="tool"><strong>get_event</strong> - Event-Details (Parameter: eventId)</div>
      </div>
      
      <h2>🧪 Testen mit MCP Inspector</h2>
      <pre><code>npx @modelcontextprotocol/inspector@latest https://${req.headers.host}/api/mcp</code></pre>
      
      <h2>⚙️ Verwendung in Cursor</h2>
      <p>Füge folgendes zu <code>.cursor/mcp.json</code> hinzu:</p>
      <pre><code>{
  "mcpServers": {
    "workshops-de": {
      "url": "https://${req.headers.host}/api/mcp"
    }
  }
}</code></pre>
      
      <h2>⚙️ Verwendung in Claude Desktop</h2>
      <pre><code>{
  "mcpServers": {
    "workshops-de": {
      "url": "https://${req.headers.host}/api/mcp",
      "transport": "http"
    }
  }
}</code></pre>
      
      <h2>📚 Weitere Informationen</h2>
      <ul>
        <li><a href="https://workshops.de">Workshops.DE</a></li>
        <li><a href="https://github.com/workshops-de/mcp-server">GitHub Repository</a></li>
        <li><a href="https://www.npmjs.com/package/@workshops.de/mcp">npm Package</a></li>
      </ul>
    </body>
    </html>
  `);
} 