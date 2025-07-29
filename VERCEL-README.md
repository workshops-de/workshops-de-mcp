# Workshops.DE MCP Server für Vercel

Dieses Projekt ist optimiert für die Deployment auf Vercel als serverlose API mit SSE (Server-Sent Events) Support.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/workshops-de/mcp-server)

## 📁 Projektstruktur

```
├── api/
│   ├── mcp.js         # REST API Endpoint für MCP Tools
│   └── mcp-sse.js     # SSE Endpoint für Streaming
├── public/
│   └── index.html     # Landing Page mit API Dokumentation
├── index.js           # Original MCP Server (für SSE)
├── package.json       # Dependencies
└── vercel.json        # Vercel Konfiguration
```

## 🔧 Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Mit Vercel CLI lokal testen
npm i -g vercel
vercel dev
```

Die App läuft dann auf http://localhost:3000

## 🌐 API Endpoints

### REST API

**GET /api/mcp**
```bash
curl https://your-app.vercel.app/api/mcp
```

**POST /api/mcp**
```bash
curl -X POST https://your-app.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"tool": "list_courses"}'
```

### SSE Stream

**GET /api/mcp-sse**
```javascript
const eventSource = new EventSource('https://your-app.vercel.app/api/mcp-sse');
eventSource.onmessage = (event) => {
  console.log(event.data);
};
```

## 🔌 MCP Client Integration

### Für Claude Desktop

`.claude/mcp.json`:
```json
{
  "mcpServers": {
    "workshops-de": {
      "url": "https://your-app.vercel.app/api/mcp"
    }
  }
}
```

### Für andere MCP Clients

Die API unterstützt Standard HTTP/REST Calls mit JSON Payloads.

## 📋 Verfügbare Tools

- `list_courses` - Alle Kurse abrufen
- `get_course_events` - Events für einen Kurs (Parameter: courseId)
- `list_trainers` - Alle Trainer abrufen
- `get_course_trainers` - Trainer für einen Kurs (Parameter: courseId)
- `list_events` - Alle kommenden Events
- `get_event` - Event-Details (Parameter: eventId)

## 🚀 Deployment

1. **Fork oder Clone** dieses Repository
2. **Vercel Account** erstellen auf vercel.com
3. **Import** das Repository in Vercel
4. **Deploy** - Vercel erkennt automatisch die Konfiguration

## ⚙️ Umgebungsvariablen

Keine erforderlich! Die API nutzt die öffentliche workshops.de API.

Optional für erweiterte Features:
- `API_KEY` - Für zukünftige Authentifizierung
- `CACHE_TTL` - Cache-Dauer in Sekunden

## 🧪 Testen

Öffne nach dem Deployment die URL im Browser. Die Landing Page zeigt:
- API Dokumentation
- Interaktive Test-Buttons
- Code-Beispiele

## 🔒 CORS

Die API hat CORS aktiviert und kann von jeder Domain aufgerufen werden. Für Production solltest du spezifische Origins konfigurieren:

```javascript
// vercel.json anpassen
{
  "headers": [{
    "source": "/api/(.*)",
    "headers": [{
      "key": "Access-Control-Allow-Origin",
      "value": "https://deine-domain.com"
    }]
  }]
}
```

## 📊 Monitoring

Vercel bietet eingebautes Monitoring:
- Function Logs
- Ausführungszeiten
- Error Tracking
- Usage Analytics

## 💡 Tipps

1. **Caching**: Vercel cached automatisch statische Responses
2. **Rate Limits**: Vercel hat großzügige Limits für den Free Tier
3. **Logs**: `vercel logs` für Live-Logs
4. **Environment**: `vercel env` für Umgebungsvariablen

## 🆘 Troubleshooting

**SSE funktioniert nicht?**
- Vercel Functions haben ein 30-Sekunden Timeout
- Für längere Streams nutze Vercel Edge Functions

**CORS Fehler?**
- Prüfe die Headers in vercel.json
- Browser-Console für Details checken

**API Fehler?**
- Vercel Dashboard → Functions → Logs
- Prüfe ob workshops.de API erreichbar ist

## 📄 Lizenz

MIT - Siehe LICENSE Datei 