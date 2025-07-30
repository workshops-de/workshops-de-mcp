# Workshops.DE MCP Server für Vercel

Dieses Projekt nutzt Vercels native MCP-Unterstützung mit dem `mcp-handler` Package für optimale Performance und einfache Integration.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/workshops-de/mcp-server)

## 📁 Projektstruktur

```
├── app/
│   ├── api/
│   │   └── [transport]/
│   │       └── route.js   # MCP Server mit mcp-handler
│   ├── layout.js          # Root Layout
│   └── page.js            # Landing Page
├── package.json           # Dependencies
├── next.config.js         # Next.js Konfiguration
└── vercel.json            # Vercel Konfiguration
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

## 🌐 MCP Endpoint

Der Server nutzt Vercels natives MCP Handler Format:

**Endpoint:** `https://your-app.vercel.app/api/sse`

### Testen mit MCP Inspector

```bash
npx @modelcontextprotocol/inspector@latest https://your-app.vercel.app
```

Dann:
1. Öffne http://127.0.0.1:6274
2. Wähle "Streamable HTTP" als Transport
3. Gib die URL ein: `https://your-app.vercel.app/api/sse`
4. Klicke auf "Connect"

## 🔌 MCP Client Integration

### Für Cursor

`.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "workshops-de": {
      "url": "https://your-app.vercel.app/api/sse"
    }
  }
}
```

### Für Claude Desktop

```json
{
  "mcpServers": {
    "workshops-de": {
      "url": "https://your-app.vercel.app/api/sse"
    }
  }
}
```

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

**Timeouts?**
- Vercel Functions haben ein 60s Timeout (konfiguriert in vercel.json)
- Alle API Calls sollten innerhalb dieser Zeit abgeschlossen sein

**Verbindung schlägt fehl?**
- Stelle sicher, dass die URL korrekt ist: `/api/sse`
- Nutze den MCP Inspector zum Testen
- Prüfe die Vercel Function Logs im Dashboard

**API Fehler?**
- Vercel Dashboard → Functions → Logs
- Prüfe ob workshops.de API erreichbar ist

**Tool funktioniert nicht?**
- Überprüfe die Parameter (z.B. courseId für get_course_events)
- Schaue in die Vercel Function Logs für Details

## 📄 Lizenz

MIT - Siehe LICENSE Datei 