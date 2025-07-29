export default function Home() {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      background: '#fafafa',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>🚀 Workshops.DE MCP Server</h1>
      <p>Dies ist ein Model Context Protocol (MCP) Server für die Workshops.DE API.</p>
      
      <div style={{
        background: '#e8f5e9',
        padding: '1rem',
        borderRadius: '8px',
        margin: '1rem 0',
        border: '1px solid #4caf50'
      }}>
        <h2 style={{ color: '#333' }}>🔌 MCP Endpoint</h2>
        <code style={{
          fontSize: '1.1em',
          background: '#f4f4f4',
          padding: '0.5rem',
          borderRadius: '4px',
          fontFamily: 'Courier New, monospace'
                 }}>https://workshops-de-mcp.vercel.app/api/mcp</code>
      </div>
      
      <h2 style={{ color: '#333' }}>📋 Verfügbare Tools</h2>
      <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
        <div style={{ margin: '0.5rem 0', padding: '0.5rem', background: '#fafafa', borderRadius: '4px' }}>
          <strong>list_courses</strong> - Zeigt alle verfügbaren Kurse
        </div>
        <div style={{ margin: '0.5rem 0', padding: '0.5rem', background: '#fafafa', borderRadius: '4px' }}>
          <strong>get_course_events</strong> - Events für einen Kurs (Parameter: courseId)
        </div>
        <div style={{ margin: '0.5rem 0', padding: '0.5rem', background: '#fafafa', borderRadius: '4px' }}>
          <strong>list_trainers</strong> - Alle Trainer anzeigen
        </div>
        <div style={{ margin: '0.5rem 0', padding: '0.5rem', background: '#fafafa', borderRadius: '4px' }}>
          <strong>get_course_trainers</strong> - Trainer für einen Kurs (Parameter: courseId)
        </div>
        <div style={{ margin: '0.5rem 0', padding: '0.5rem', background: '#fafafa', borderRadius: '4px' }}>
          <strong>list_events</strong> - Alle kommenden Events
        </div>
        <div style={{ margin: '0.5rem 0', padding: '0.5rem', background: '#fafafa', borderRadius: '4px' }}>
          <strong>get_event</strong> - Event-Details (Parameter: eventId)
        </div>
      </div>
      
      <h2 style={{ color: '#333' }}>🧪 Testen mit MCP Inspector</h2>
      <pre style={{
        background: '#f4f4f4',
        padding: '1rem',
        borderRadius: '4px',
        overflow: 'auto',
        fontFamily: 'Courier New, monospace'
      }}>
        <code>npx @modelcontextprotocol/inspector@latest https://workshops-de-mcp.vercel.app/api/mcp</code>
      </pre>
      
      <h2 style={{ color: '#333' }}>⚙️ Verwendung in Cursor</h2>
      <p>Füge folgendes zu <code style={{ background: '#f4f4f4', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>.cursor/mcp.json</code> hinzu:</p>
      <pre style={{
        background: '#f4f4f4',
        padding: '1rem',
        borderRadius: '4px',
        overflow: 'auto',
        fontFamily: 'Courier New, monospace'
      }}>
                                   <code>{`{
  "mcpServers": {
    "workshops-de": {
      "url": "https://workshops-de-mcp.vercel.app/api/mcp"
    }
  }
}`}</code>
      </pre>
      
      <h2 style={{ color: '#333' }}>⚙️ Verwendung in Claude Desktop</h2>
      <pre style={{
        background: '#f4f4f4',
        padding: '1rem',
        borderRadius: '4px',
        overflow: 'auto',
        fontFamily: 'Courier New, monospace'
      }}>
                                   <code>{`{
  "mcpServers": {
    "workshops-de": {
      "url": "https://workshops-de-mcp.vercel.app/api/mcp",
      "transport": "http"
    }
  }
}`}</code>
      </pre>
      
      <h2 style={{ color: '#333' }}>📚 Weitere Informationen</h2>
      <ul style={{ lineHeight: '1.8' }}>
        <li><a href="https://workshops.de">Workshops.DE</a></li>
        <li><a href="https://github.com/workshops-de/mcp-server">GitHub Repository</a></li>
        <li><a href="https://www.npmjs.com/package/@workshops.de/mcp">npm Package</a></li>
      </ul>
    </div>
  );
} 